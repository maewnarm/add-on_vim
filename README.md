## How to start project

#### Start Prisma + sqlite

See readme in prisma folder

#### Create Enviroment for production

```bash
# generate UUID for using in MQTT free public broker (EMQX)
NEXT_PUBLIC_TOPIC_UUID = ...
```

#### Notes

- MQTT Topic defination

```bash
# send signal from application to machine
1. Send signal by click signal button
uuid/{projectName}/to_mc/{unit_name}/{signal_address}/{signal_type}/{signal_index}
payload = {
  "value": 0 | 1
}

# receive signal from machine (Datashare) to application
1. Receive signal value for confirm machine signal changed
uuid/{project_name}/from_mc/signal/{unit_name}/{signal_address}/{signal_type}/{signal_index}
payload = {
  "value" : 0 | 1
}

2. Receive signal step time
uuid/{project_name}/from_mc/signal/timeline/{unit_name}/{signal_address}
payload ={
  "index" : number[],
  "value" : (0 | 1)[]
}

3. Receive ct value
uuid/{project_name}/from_mc/result/actual
payload = {
  "ct": number
}
```
