pipeline {
    agent any

    environment {
        DOCKER_USER = 'zubairalamdev'
        DOCKER_PASS = credentials('docker-pass')
        GIT_TOKEN   = credentials('GIT_TOKEN')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    GIT_COMMIT_SHORT = sh(returnStdout: true, script: "git rev-parse --short HEAD").trim()
                }
            }
        }

        stage('Build & Push Docker Image') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-pass', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh """
                      echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                      docker build -t ${DOCKER_USER}/myapp:${GIT_COMMIT_SHORT} .
                      docker push ${DOCKER_USER}/myapp:${GIT_COMMIT_SHORT}
                      docker logout
                    """
                }
            }
        }

        stage('Update Infra Repo') {
            steps {
                withCredentials([string(credentialsId: 'GIT_TOKEN', variable: 'GIT_TOKEN')]) {
                    sh """
                        rm -rf infra
                        git clone https://zubairalamdev:${GIT_TOKEN}@github.com/zubairalamdev-alam/infra.git
                        cd infra
                        git checkout main

                        # Update image tag in deployment file
                        sed -i "s|image: zubairalamdev/myapp:.*|image: zubairalamdev/myapp:${GIT_COMMIT_SHORT}|" k8s/deployment.yaml

                        # Commit & push
                        git config user.email "ci@jenkins"
                        git config user.name "Jenkins CI"
                        git add k8s/deployment.yaml
                        git commit -m "Update image tag to ${GIT_COMMIT_SHORT}" || echo "No changes to commit"
                        git push origin main || echo "No changes to push"
                    """
                }
            }
        }
    }
}
