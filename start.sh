docker build -t dexterquazi/bankchimp .   
docker login -u dexterquazi -p "##Love##1"   
docker push docker.io/dexterquazi/bankchimp
docker run -d --name app -p 80:80 dexterquazi/bankchimp