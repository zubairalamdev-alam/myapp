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
          // Short commit hash
          GIT_COMMIT_SHORT = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
        }
      }
    }

    stage('Build & Push Docker Image') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 
'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh """
            echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
            docker build -t ${DOCKERHUB_REPO}:${GIT_COMMIT_SHORT} .
            docker push ${DOCKERHUB_REPO}:${GIT_COMMIT_SHORT}
            docker logout
          """
        }
      }
    }

    stage('Update Infra Repo') {
      steps {
        withCredentials([string(credentialsId: 'git-token', variable: 'GIT_TOKEN')]) {
          sh '''
            rm -rf infra || true
            git clone https://zubairalamdev:${GIT_TOKEN}@github.com/zubairalamdev-alam/infra.git
            cd infra
            git checkout ${INFRA_BRANCH}

            # Update deployment YAML with new image tag
            sed -i "s|image: ${DOCKERHUB_REPO}:.*|image: ${DOCKERHUB_REPO}:${GIT_COMMIT_SHORT}|" 
k8s/deployment.yaml

            git config user.email "ci-bot@codiantech.com"
            git config user.name "Jenkins CI"
            git add k8s/deployment.yaml
            git commit -m "Update image to ${DOCKERHUB_REPO}:${GIT_COMMIT_SHORT}" || echo "No 
changes to commit"
            git push origin ${INFRA_BRANCH}
          '''
        }
      }
    }
  }
}

