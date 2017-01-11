FROM node:5.11

MAINTAINER datapunt.ois@amsterdam.nl

EXPOSE 80

RUN apt-get update \
 && apt-get install -y git nginx build-essential \
 && apt-get clean \
 && npm install -g bower grunt-cli \
 && mkdir /app

WORKDIR /app
COPY *.json /app/

RUN npm cache clean \
 && bower cache clean --allow-root \
 && npm install \
 && ./node_modules/protractor/node_modules/webdriver-manager/bin/webdriver-manager update \
 && bower install --allow-root

COPY . /app/

RUN grunt build-release \
 && cp -r /app/build/. /var/www/html/

COPY default.conf /etc/nginx/conf.d/
RUN rm /etc/nginx/sites-enabled/default

# forward request and error logs to docker log collector
RUN ln -sf /dev/stdout /var/log/nginx/access.log \
	&& ln -sf /dev/stderr /var/log/nginx/error.log

CMD ["nginx", "-g", "daemon off;"]
