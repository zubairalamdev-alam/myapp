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

    stage('Build Docker Image') {
      steps {
        script {
          sh """
            docker build -t ${DOCKERHUB_REPO}:${GIT_COMMIT_SHORT} .
            docker push ${DOCKERHUB_REPO}:${GIT_COMMIT_SHORT}
          """
        }
      }
    }

    stage('Update Infra Repo') {
      steps {
        withCredentials([string(credentialsId: 'git-token', variable: 'GIT_TOKEN')]) {
          sh '''
            # remove if old
            rm -rf infra

            # clone with token
            git clone https://zubairalamdev:${GIT_TOKEN}@github.com/zubairalamdev-alam/infra.git
            cd infra
            git checkout ${INFRA_BRANCH}

            # update YAML (example: deployment.yaml)
            sed -i "s|image: ${DOCKERHUB_REPO}:.*|image: ${DOCKERHUB_REPO}:${GIT_COMMIT_SHORT}|" 
k8s/deployment.yaml

            git config user.email "ci-bot@codiantech.com"
            git config user.name "Jenkins CI"
            git add k8s/deployment.yaml
            git commit -m "Update image to ${DOCKERHUB_REPO}:${GIT_COMMIT_SHORT}"
            git push origin ${INFRA_BRANCH}
          '''
        }
      }
    }
  }
}

