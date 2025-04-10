#칼라미 리뉴얼 퍼블리싱프로젝트

##기본폴더구조

```
project/
├── src/
│   ├── templates/
│   │   ├── layouts/
│   │   ├── partials/
│   │   └── pages/
│   ├── scss/
│   │   └── style.scss
│   ├── js/
│   │   └── main.js
│   └── data/
│       └── global.json
├── dist/
│   ├── css/
│   ├── js/
│   └── *.html
├── gulpfile.js
├── package.json
```
환경 : gulp + nunjucks + scss 

구동 : npm install 후 npm run copy:images && npm run dev
이미지는 중간에 추가시에 npm run copy:images 따로 실행해줘야함 