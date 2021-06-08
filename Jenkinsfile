pipeline {
  agent any
  options {
    timeout(time: 5, unit: 'DAYS')
  }

  environment {
    PROJECT_PREFIX = "${BRANCH_NAME}_${COMMIT_HASH}_${BUILD_NUMBER}_"

    IMAGE_FRONTEND_BASE = 'docker-registry.data.amsterdam.nl/atlas/app'
    IMAGE_FRONTEND_BUILD = "${IMAGE_FRONTEND_BASE}:${BUILD_NUMBER}"
    IMAGE_FRONTEND_ACCEPTANCE = "${IMAGE_FRONTEND_BASE}:acceptance"
    IMAGE_FRONTEND_PRODUCTION = "${IMAGE_FRONTEND_BASE}:production"

    PLAYBOOK = 'deploy.yml'

    PRODUCTION_BRANCH = 'main'
    ACCEPTANCE_BRANCH = 'develop'
  }

  stages {
    stage('Build and push Docker image') {
      options {
        timeout(time: 30, unit: 'MINUTES')
      }
      steps {
        sh "docker build -t ${IMAGE_FRONTEND_BUILD} --shm-size 1G ."
        sh "docker push ${IMAGE_FRONTEND_BUILD}"
      }
    }

    stage('Deploy to acceptance') {
      when { branch ACCEPTANCE_BRANCH }
      options {
        timeout(time: 5, unit: 'MINUTES')
      }
      steps {
        sh "docker tag ${IMAGE_FRONTEND_BUILD} ${IMAGE_FRONTEND_ACCEPTANCE}"
        sh "docker push ${IMAGE_FRONTEND_ACCEPTANCE}"
        build job: 'Subtask_Openstack_Playbook', parameters: [
          [$class: 'StringParameterValue', name: 'INVENTORY', value: 'acceptance'],
          [$class: 'StringParameterValue', name: 'PLAYBOOK', value: "${PLAYBOOK}"],
          [$class: 'StringParameterValue', name: 'PLAYBOOKPARAMS', value: "-e cmdb_id=app_dataportaal"]
        ]
      }
    }

    stage('Production deployment approval') {
      when { branch PRODUCTION_BRANCH }
      steps {
        script {
          input 'Deploy to Production?'
          echo 'Okay, moving on'
        }
      }
    }

    stage('Deploy to production') {
      when { branch PRODUCTION_BRANCH }
      options {
        timeout(time: 5, unit: 'MINUTES')
      }
      steps {
        sh "docker tag ${IMAGE_FRONTEND_BUILD} ${IMAGE_FRONTEND_PRODUCTION}"
        sh "docker push ${IMAGE_FRONTEND_PRODUCTION}"
        build job: 'Subtask_Openstack_Playbook', parameters: [
          [$class: 'StringParameterValue', name: 'INVENTORY', value: 'production'],
          [$class: 'StringParameterValue', name: 'PLAYBOOK', value: "${PLAYBOOK}"],
          [$class: 'StringParameterValue', name: 'PLAYBOOKPARAMS', value: "-e cmdb_id=app_dataportaal"]
        ]
      }
    }
  }

  post {
    success {
      echo 'Pipeline success'
    }

    failure {
      echo 'Something went wrong while running pipeline'
      slackSend(
        channel: 'ci-channel',
        color: 'danger',
        message: "${JOB_NAME}: failure ${BUILD_URL}"
      )
    }
  }
}
