# TCHIBO DEALERSHIPS APP - DOCUMENTATION -

## Table of Contents

1. [Getting the app running](#getting-the-app-running)
   1. [Deploying backend on a virtual machine in the cloud](#deploying-backend-on-a-virtual-machine-in-the-cloud)
   2. [Deploying frontend on Netlify](#deploying-frontend-on-netlify)
   3. [Troubleshooting](#troubleshooting)
2. [Tech stack choices](#tech-stack-choices)
   1. [Why Java + Spring Boot?](#why-java--spring-boot)
   2. [Why Postgresql?](#why-postgresql)
   3. [Why Google Cloud?](#why-google-cloud)
   4. [Why Typescript + React.js?](#why-typescript--reactjs)
   5. [Why Netlify?](#why-netlify)

## Getting the app running

This web application is composed of two main pieces: a backend (implemented in Java + Spring Boot) and a frontend (written in Typescript + React.js). This section will guide you through deploying the application and getting it up and running.

### Deploying backend on a virtual machine in the cloud

To deploy the backend, we will use a virtual machine created in Google Cloud. Follow the steps below:

1. **Creating a subdomain**

   - Create an account on [FreeDNS](https://freedns.afraid.org).
   - Go to [FreeDNS subdomain](https://freedns.afraid.org/subdomain) and create a new subdomain.
   - Complete the Destination field with the public IP of your VM later in the process.

2. **Creating the Google Cloud VM**
   - Create a Google Cloud account on [Google Cloud Console](https://console.cloud.google.com).
   - Create a VM instance with the following minimum specs:
     - 1GB RAM
     - 30GB storage
     - It is recommended to use Ubuntu Server 22.04 or newer.
   - Connect to the VM via SSH and install the following:
     - postgres: [How to Install PostgreSQL on Ubuntu 20.04](https://www.digitalocean.com/community/tutorials/how-to-install-postgresql-on-ubuntu-20-04-quickstart)
     - java (openjdk-18 or newer): [Install Java on Ubuntu 22.04](https://linuxhint.com/install-java-ubuntu-22-04/)
     - maven: [How to Install Maven on Ubuntu](https://www.hostinger.com/tutorials/how-to-install-maven-on-ubuntu)
     - git (if it is not already installed): [How to Install Git on Ubuntu 20.04](https://www.digitalocean.com/community/tutorials/how-to-install-git-on-ubuntu-20-04)
     - docker: [Install Docker on Ubuntu](https://docs.docker.com/engine/install/ubuntu/)
     - docker-compose: [How to Install and Use Docker Compose on Ubuntu 20.04](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-20-04)
   - Connect to your GitHub account (if necessary) and clone the repository to the virtual machine:
     ```
     $ gh repo clone UBB-SDI-23/lab-4-Atchibo
     ```
   - Go to `src/main/java/com/example/assignment1_1/config/WebSocketConfig.java` and `src/main/java/com/example/assignment1_1/config/CorsFilter.java` and change "exquisite-fox.chickenkiller.com

" to the name of your domain.

- Go to the `lab-4-Atchibo` folder and create a .jar:
  ```
  $ cd lab-4-Atchibo
  $ mvn install
  ```
- Connect to Postgres and create a new database called "mpp":
  ```
  $ sudo -u postgres psql
  $ CREATE DATABASE mpp;
  ```
- Change the password of your Postgres user to "postgres" and then disconnect:
  ```
  $ ALTER USER postgres WITH PASSWORD 'postgres';
  $ \q
  ```
- Copy the .jar created in step 5) from `/target` to `/src/main/docker`:
  ```
  $ mv /target/Assignment1-0.0.1-SNAPSHOT.jar /src/main/docker
  ```
- Go to `/src/main/docker`:
  ```
  $ cd src/main/docker
  ```
- Configure the Nginx files:
  - Open `nginx/conf.d/default.conf` and replace "exquisite-fox.chickenkiller.com" everywhere in the file with your own domain name created on [FreeDNS subdomain](https://freedns.afraid.org/subdomain).
  - Replace the contents of the other 4 files in the "nginx" folder with the content of your own files. These files are needed for the SSL certificate. You can obtain an SSL certificate using Certbot ([Using Free SSL/TLS Certificates from Let's Encrypt with Nginx](https://www.nginx.com/blog/using-free-ssltls-certificates-from-lets-encrypt-with-nginx/)).
- Go back to [FreeDNS subdomain](https://freedns.afraid.org/subdomain) and edit the Destination field of your subdomain with the public IP of your VM (it may take a while to propagate, so be patient).
- Now, make sure you are in `src/main/docker` and run the following command:
  ```
  $ sudo docker-compose up --build
  ```
- The first time, it may take a while to populate the database with the initial data. After that, the server should be up and running. To test whether it works, you should be able to access your backend in a browser or Postman by entering the HTTPS address that you set up in the Nginx default.conf file and on FreeDNS website.

Congratulations! Now your backend should be up and running.

### Deploying frontend on Netlify

We will use Netlify to host our React application. Follow the steps below:

1. Make sure that the frontend project ([lab-5x-ATchibo](https://github.com/UBB-SDI-23/lab-5x-ATchibo)) is cloned or forked on your GitHub account.
2. Modify the "backendUrl" variable in `src/Values.tsx` from the React project to the name of your domain and push the changes to your repo.
3. Create a Netlify account at [Netlify](https://app.netlify.com/) (it is highly recommended to connect with GitHub).
4. Create a new website and link it to your previously created repo.
5. After creating the website, go to Site settings → Build & Deploy → Continuous deployment and make sure to set the Production branch to "development".
6. Go to Deploys and click on Trigger Deploy → Clear cache and deploy site. If you encounter a building error, it is likely due to outdated node modules. To fix that, go to Site settings → Environment variables and add a new Environment variable called "NPM_FLAGS" with the value "--force". You can also provide your OPENAPI key if you want to use the Description suggestion functionality. Add a key "REACT_APP_OPENAPI_KEY" and put your key in there.
7. After the build process is completed, your website should be online!

### Troubleshooting

1. Can't access backend via the domain, but it works if accessed via IP:
   This might be a FreeDNS issue as it takes some time to propagate. Make sure you have the correct IP set up and wait for at least 5-10 minutes, then try again.

2. When running `docker-compose up`, it tells me that some ports are already in use:
   Stop the containers with:

   ```
   $ sudo docker-compose down
   ```

   Then identify the processes running on the problematic ports, kill them, and try again.

3. The frontend is not able to make requests to the backend:
   Verify that:
   - Your backend is accessible via HTTPS.
   - You have modified the "backendUrl" variable in `src/Values.tsx` from the React project to the name of your domain.
   - You have modified the old domain value with your domain in the Spring Boot project in `src/main/java/com/example/assignment1_1/config/WebSocketConfig.java` and `src/main/java/com/example/assignment1_1/config/CorsFilter.java`.

## Tech Stack Choices

Now, let's explain why I chose the technologies used to build this application.

### 2.1. Why Java + Spring Boot?

I chose to implement the backend using Java + Spring Boot mainly because I was already familiar with them, and I wanted to deepen my knowledge in this field. Here are some reasons for this choice:

- Spring Boot is a framework based on microservices, providing a fully enclosed application with embedded application servers.
- It features automatic configuration for web development, making it fast and easy to set up the application environment.
- Spring Boot offers strong type-safe configuration, resulting in a more verbose and less error-prone program.
- Annotations help reduce boilerplate code and simplify the configuration of multiple classes and entities.
- Features like auto-configuration saved me time.
- It is easy to integrate the project with the rest of the Spring ecosystem, such as JDBC and Spring Security.

Trade-offs:

- It is slightly more memory-consuming than some of its competitors.
- Some functionalities may require more work to implement due to the verbose nature of Java.
- Integrating AI functionalities may be a bit more challenging than with Django, as most AI programs are written in Python by default.

### 2.2. Why Postgresql?

I chose Postgresql as the database because:

- It is feature-rich and can handle complex queries and large databases with ease.
- It supports a wide range of data types.
- It is highly scalable.
- It has more features than other database management systems.
- It is object-relational, ACID-compliant, highly concurrent, and offers NoSQL support.
- It receives frequent updates.

Trade-offs:

- It can be slightly more complex and complicated to set up.
- It may be slower for simple, read-heavy workflows.

### 2.3. Why Google Cloud?

AWS and Google Cloud are the main competitors in this segment. However, I chose Google Cloud for the following reasons:

- It is easier to set up a virtual machine thanks to a more intuitive interface (from my point of view).
- It is more student-friendly, offering $300 in credits when you create an account, and providing more free features compared to AWS.
- The integrated SSH console is superior.

Trade-offs:

- Sometimes the Google Cloud website loads slowly.

### 2.4. Why Typescript + React.js?

I chose to work with Typescript and React.js because:

- React.js is simple to learn, has a great community, and provides many

libraries and ready-to-use components.

- It follows a component-based architecture, which promotes reusability and code organization.
- It offers fast rendering and efficient updating through the use of a virtual DOM.
- It is highly flexible and can be used to build single-page applications (SPAs) or complex user interfaces.
- Typescript brings static typing to JavaScript, enabling better error detection during development and improved code maintenance.
- The combination of React.js and Typescript ensures better code quality and a more pleasant development experience.

Trade-offs:

- Steeper learning curve compared to other frameworks.
- Debugging can sometimes be challenging.

### 2.5. Why Netlify?

Netlify was chosen to host the React.js frontend because:

- It provides seamless integration with GitHub for automatic deployments.
- It offers easy configuration for custom domains and SSL certificates.
- It has a user-friendly interface and makes it easy to manage and deploy websites.
- It has a free tier that provides sufficient resources for hosting small to medium-sized applications.

Trade-offs:

- The free tier has some limitations in terms of resources and scalability.
- Limited control over server configurations compared to self-hosting.
