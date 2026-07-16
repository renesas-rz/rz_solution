#!/usr/bin/env bash

# serve.sh
# To serve webpage at yours local ip with unoccupied port start from 8000

ip=$(hostname -I | awk '{print $1}')
port=8000

while nc -vz $ip $port &>/dev/null
do
    port=$((port + 1))
done

address=$ip:$port

echo "will serving on http://$address ..."

mkdocs serve -a $address
