pipeline {
 agent any

    stages {
        stage('BuildTEMPLATE') {
            steps {
                echo 'git checkout qal && CMNT=$(git rev-parse HEAD|cut -b 1-8) && cat k8s/deploy.yaml|sed "s/latest/$CMNT/g" >k8s/deploy.yaml'
            }
        }
        stage('Test') {
            steps {
                echo 'git add . && git commit -m automated '
            }
        }
        stage('Deploy') {
            steps {
                echo 'cat k8s/deploy.yaml'
             
            }
        }
    }
}
