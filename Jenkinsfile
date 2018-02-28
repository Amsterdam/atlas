pipeline {
  agent any
  options {
    timeout(time: 1, unit: 'HOURS')
  }
  environment {
    IMAGE_BASE = "build.datapunt.amsterdam.nl:5000/atlas/app"
    IMAGE_BUILD = "${IMAGE_BASE}:${BUILD_NUMBER}"
    IMAGE_ACCEPTANCE = "${IMAGE_BASE}:acceptance"
    IMAGE_PRODUCTION = "${IMAGE_BASE}:production"
    IMAGE_LATEST = "${IMAGE_BASE}:latest"
  }
  stages {
    stage('Clean') {
      // TODO remove this stage when jenkins jobs run in isolation
      steps {
        sh 'docker ps'
        sh 'docker network ls'
        sh 'docker-compose down -v || true'
        sh 'docker network prune'
        sh 'docker ps'
        sh 'docker network ls'
      }
    }
    stage('Test & Bakkie') {
      // failFast true // fail if one of the parallel stages fail
      parallel {
        stage('Deploy Bakkie') {
          when { not { branch 'master' } }
          steps {
            sh "scripts/bakkie.sh ${env.BRANCH_NAME}"
          }
        }
        stage('Linting') {
          steps {
            sh 'docker network prune'
            sh 'docker-compose up --build --exit-code-from test-lint test-lint'
            // echo 'Skip'
          }
        }
        stage('Unit') {
          steps {
            sh 'docker network prune'
            sh 'docker-compose up --build --exit-code-from test-unit test-unit'
            // echo 'Skip'
          }
        }
        stage('Functional E2E') {
          environment {
            // Setting compose project name helps prevent service clash in unisolated Jenkins slaves
            COMPOSE_PROJECT_NAME   = 'atlas-func-e2e'
            USERNAME_EMPLOYEE      = 'atlas.employee@amsterdam.nl'
            USERNAME_EMPLOYEE_PLUS = 'atlas.employee.plus@amsterdam.nl'
            PASSWORD_EMPLOYEE      = credentials('PASSWORD_EMPLOYEE')
            PASSWORD_EMPLOYEE_PLUS = credentials('PASSWORD_EMPLOYEE_PLUS')
          }
          steps {
            sh 'docker network prune'
            sh 'docker-compose up --build --exit-code-from test-e2e-functional test-e2e-functional'
            // echo 'Skip'
          }
          post {
            always {
              sh 'docker-compose down -v || true'
            }
          }
        }
        stage('Aria E2E') {
          environment {
            // Setting compose project name helps prevent service clash in unisolated Jenkins slaves
            COMPOSE_PROJECT_NAME   = 'atlas-aria-e2e'
          }
          steps {
            sh 'docker network prune'
            sh 'docker-compose up --build --exit-code-from test-e2e-aria test-e2e-aria'
            // echo 'Skip'
          }
          post {
            always {
              sh 'docker-compose down -v || true'
            }
          }
        }
      }
      post {
        always {
          sh 'docker-compose down -v || true'
        }
      }
    }
    stage('Build A') {
      steps {
        sh "docker build -t ${IMAGE_BUILD} " +
          "--shm-size 1G " +
          "--build-arg BUILD_ENV=acc " +
          "."
        sh "docker push ${IMAGE_BUILD}"
      }
    }
    stage('Deploy A (Master)') {
      when { branch 'master' }
      steps {
        sh "docker pull ${IMAGE_BUILD}"
        sh "docker tag ${IMAGE_BUILD} ${IMAGE_ACCEPTANCE}"
        sh "docker push ${IMAGE_ACCEPTANCE}"
        build job: 'Subtask_Openstack_Playbook', parameters: [
          [$class: 'StringParameterValue', name: 'INVENTORY', value: 'acceptance'],
          [$class: 'StringParameterValue', name: 'PLAYBOOK', value: 'deploy-client.yml']
        ]
      }
    }
    stage('Build P (Master)') {
      when { branch 'master' }
      steps {
        // NOTE BUILD_ENV intentionaly not set (using Dockerfile default)
        sh "docker build -t ${IMAGE_PRODUCTION} " +
            "--shm-size 1G " +
            "."
        sh "docker tag ${IMAGE_PRODUCTION} ${IMAGE_LATEST}"
        sh "docker push ${IMAGE_PRODUCTION}"
        sh "docker push ${IMAGE_LATEST}"
      }
    }
    stage('Deploy pre P (Master)') {
      when { branch 'master' }
      steps {
        build job: 'Subtask_Openstack_Playbook', parameters: [
          [$class: 'StringParameterValue', name: 'INVENTORY', value: 'acceptance'],
          [$class: 'StringParameterValue', name: 'PLAYBOOK', value: 'deploy-client-pre.yml']
        ]
      }
    }
    stage('Waiting for approval (Master)') {
      when {
        branch 'master'
      }
      options {
        timeout(time:5, unit:'DAYS')
      }
      steps {
        script {
          input "Deploy to Production?"
          echo "Okay, moving on"
        }
      }
    }
    stage('Deploy P (Master)') {
      when { branch 'master' }
      steps {
        build job: 'Subtask_Openstack_Playbook', parameters: [
          [$class: 'StringParameterValue', name: 'INVENTORY', value: 'production'],
          [$class: 'StringParameterValue', name: 'PLAYBOOK', value: 'deploy-client.yml']
        ]
      }
    }
  }
  post {
    always {
      echo 'Cleaning'
      sh 'docker-compose down -v || true'
      sh 'docker network prune'
    }

    success {
      echo 'Pipeline success'
    }

    failure {
      echo 'Something went wrong while running pipeline'
      slackSend(
        channel: 'ci-channel',
        color: 'danger',
        message: "${env.JOB_NAME}: failure ${env.BUILD_URL}"
      )
    }
  }
}
