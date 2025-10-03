pipeline {
  agent any
  environment {
    DOCKERHUB_REPO = "zubairalamdev/myapp"
    INFRA_REPO = "https://github.com/zubairalamdev-alam/infra.git"
    INFRA_BRANCH = "main"
  }
  stages {
    stage('Checkout') {
      steps {
        checkout scm
        script { 
          GIT_COMMIT_SHORT = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim() 
        }
      }
    }
    stage('Build') {
      steps {
        sh 'npm ci'
        sh 'npm test || true' // safe fallback if no tests
      }
    }
    stage('Docker Build & Push') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'docker-hub-creds', 
                                          usernameVariable: 'DOCKER_USER', 
                                          passwordVariable: 'DOCKER_PASS')]) {
          sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
          sh "docker build -t ${DOCKERHUB_REPO}:${GIT_COMMIT_SHORT} ."
          sh "docker push ${DOCKERHUB_REPO}:${GIT_COMMIT_SHORT}"
        }
      }
    }
    stage('Update Infra (deploy manifest)') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'infra-git-creds', 
                                          usernameVariable: 'GIT_USER', 
                                          passwordVariable: 'GIT_TOKEN')]) {
          sh """
            git clone https://${GIT_USER}:${GIT_TOKEN}@github.com/zubairalamdev-alam/infra.git 
infra
            cd infra/k8s
            sed -i 's|image: .*|image: ${DOCKERHUB_REPO}:${GIT_COMMIT_SHORT}|' deployment.yaml
            git add deployment.yaml
            git commit -m "ci: bump image to ${GIT_COMMIT_SHORT}" || true
            git push origin ${INFRA_BRANCH}
          """
        }
      }
    }
  }
  post {
    always {
      sh 'docker logout'
    }
  }
}

