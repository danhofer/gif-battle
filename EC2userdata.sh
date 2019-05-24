#!/bin/bash

yum update -y

yum install -y docker

curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.1/install.sh | bash

export NVM_DIR="$HOME/.nvm"

[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

service docker start

nvm install node

yum install git -y

git clone https://github.com/danhofer/react-gif-game.git /home/ec2-user/react-gif-game

cd /home/ec2-user/react-gif-game

echo "REACT_APP_PUBLIC_IP=$(curl ifconfig.me)" >> /home/ec2-user/react-gif-game/.env.production

docker build -t react-gif-game /home/ec2-user/react-gif-game

docker run -p 80:5000 -d react-gif-game

git clone https://github.com/danhofer/gif-game-server.git /home/ec2-user/gif-game-server

cd /home/ec2-user/gif-game-server

docker build -t gif-game-server .

docker run -p 8080:8080 -d gif-game-server

aws ec2 create-tags --region $(curl -s http://169.254.169.254/latest/meta-data/placement/availability-zone | sed 's/[a-z]$//') --resources $(curl http://169.254.169.254/latest/meta-data/instance-id) --tags Key='Name',Value='userdataComplete'