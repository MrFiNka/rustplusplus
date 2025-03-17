:restart
echo ---------------------- START (%DATE:~0,2%.%DATE:~3,2% %TIME:~0,8%) ----------------------
#git checkout -- package-lock.json
git pull
#export NPM_CONFIG_YES=true
#npm install --legacy-peer-deps --force --yes
node .
rm -vrf logs
rm -vrf maps
echo ---------------------- STOP  (%DATE:~0,2%.%DATE:~3,2% %TIME:~0,8%) ----------------------
sleep 5
goto restart