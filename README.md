# MyTasks Projesi

MyTasks, kullanıcıların görevleri yönetmelerine ve takımlarla işbirliği yapmalarına yardımcı olan bir görev yönetimi uygulamasıdır.

## Kurulum ve Yapılandırma
1. Projeyi yerel makinenize kopyalayın:

git clone <repo URL>

markdown
Copy code

2. Sanal ortamı etkinleştirin ve gereksinimleri yükleyin:

cd new_mytasks_project
python -m venv env
env\Scripts\activate
pip install -r requirements.txt

## Kullanılan Teknolojiler
backend
asgiref==3.6.0
Django==4.2
django-cors-headers==3.14.0
django-filter==23.1
djangorestframework==3.14.0
djangorestframework-simplejwt==5.2.2
PyJWT==2.6.0
pytz==2023.3
sqlparse==0.4.4
tzdata==2023.3

frontend
{
  "name": "frontend",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@emotion/react": "^11.10.6",
    "@emotion/styled": "^11.10.6",
    "@mui/material": "^5.12.1",
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "axios": "^1.3.6",
    "bootstrap": "^5.2.3",
    "date-fns": "^2.29.3",
    "lodash": "^4.17.21",
    "react": "^18.2.0",
    "react-bootstrap": "^2.7.4",
    "react-dom": "^18.2.0",
    "react-icons": "^4.8.0",
    "react-modal": "^3.16.1",
    "react-router-dom": "^6.10.0",
    "react-scripts": "5.0.1",
    "react-select": "^5.7.2",
    "styled-components": "^5.3.9",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}


## API Belgelendirmesi

(API belgelendirme ve örneklerini buraya ekleyin)

## Katkıda Bulunma

(Katkıda bulunma sürecini ve yönergelerini buraya ekleyin)

## Lisans

Bu proje (Lisans Adı) lisansı altında lisanslanmıştır. (Lisans bağlantısını ekleyin)

## İletişim

Herhangi bir soru veya geri bild
