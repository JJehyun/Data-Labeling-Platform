데이터 라벨링을 위한 웹 페이지 프로젝트
우하
<center>

# 기술스택 🛠

## FrontEnd

<div style={display:flex}>
<img src="https://img.shields.io/badge/React-3776AB?style=for-the-badge&logo=React&logoColor=white">
<img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=white">
<img alt="TypeScript" src="https://img.shields.io/badge/recoil-FAB040?style=for-the-badge&logo=Litecoin&logoColor=white">
<img alt="Axios" src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=Axios&logoColor=white">
<div>


## Backend

<div style={display:flex}>
<img alt="Axios" src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=Express&logoColor=white">
<img alt="Axios" src="https://img.shields.io/badge/MariaDB-003545?style=for-the-badge&logo=MariaDB&logoColor=white">
<img alt="Axios" src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=Docker&logoColor=white">
<div>
  
---

  
## Prerequisites

1. Clone the repo

```bash
git clone https://github.com/JJehyun/Data-Labeling-Platform.git
```

2. Install packages

```bash
yarn install
cd server && yarn install && cd ..
cd client && yarn install && cd ..
```

3. client build & run project

```bash
env PORT=3000 API_PORT=3001 yarn start
```

## Build For Production

Build the client app:

```bash
cd client && yarn run build && cd ..
```

```bash
env PORT=80 NODE_ENV=production node server/src/index.js
```
  
</center>

## 데이터 라벨링 작업



![](./client/src/help/tutorial/auto-tracing.gif)

![](./client/src/help/tutorial/ml-semantic-segmentation.gif)


---

## 기타 관리자 페이지

| 제작페이지    | 제작페이지    | 제작페이지    |
| ------- | ------- | ------- |
| ![2022-12-05 23;07;35_](https://user-images.githubusercontent.com/86187456/205658996-4fd5cccb-7764-4753-91b8-8bce378f8156.png) | ![2022-12-05 23;08;49_](https://user-images.githubusercontent.com/86187456/205659003-42e8dfc8-6d34-400a-9908-6564b3d3f566.png) | ![2022-12-05 23;09;04_](https://user-images.githubusercontent.com/86187456/205659010-2e7e8f0f-17da-4199-8796-9af210ab6870.png) |
  |![2022-12-05 23;09;20_](https://user-images.githubusercontent.com/86187456/205659021-3dee14ff-f60d-4dca-8944-19995dc00932.png)| ![2022-12-05 23;09;39_](https://user-images.githubusercontent.com/86187456/205659036-a854da08-9b6f-4df5-8add-7fafeb091c3c.png) | ![2022-12-05 23;10;13_](https://user-images.githubusercontent.com/86187456/205659042-1269a947-2e58-4dc6-a9a6-cfc3fa186211.png) |

## Run in Docker

The default `Dockerfile` points to `/uploads` and `/db/db.sqlite` for persisted data, make sure to prepare those in advance to be mounted over. Here is an example mounting a local host directory:

```bash
mkdir ~/containersmnt/
mkdir ~/containersmnt/db/
mkdir ~/containersmnt/uploads/
```

Now build the container:

```bash
docker build -t imslavko/image-labeling-tool .
```

Run attaching the mounts:

```bash
docker run -p 5000:3000 -u $(id -u):$(id -g) -v ~/containersmnt/uploads:/uploads -v ~/containersmnt/db:/db -d imslavko/image-labeling-tool
```

Access the site at `localhost:5000`.

### Run with docker-compose

- Checkout the `docker-compose.yml` for detailed configuration.
- Need to set & export environment variable CURRENT_UID before running.

```bash
# if it needs to build the docker image,
CURRENT_UID=$(id -u):$(id -g) docker-compose up -d --build

# if it only needs to run,
CURRENT_UID=$(id -u):$(id -g) docker-compose up -d
```
