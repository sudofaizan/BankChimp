pipeline {
 agent {
    node {
        label 'docker'
        customWorkspace '/'
    }
}

    stages {
        stage('Build') {
            steps {
                sh "docker ps"
            }
        }
        stage('Test') {
            steps {
                echo 'Testing..'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying....'
            }
        }
    }
}
