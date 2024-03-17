# Содержание

1. [Задание](#task)
2. [Стэк](#stack)
3. [Структура](#structure)
4. [Запуск с помощью `pm2`](#pm2)
5. [Запуск с помощью `docker-compose`](#docker-compose)
6. [Как работать с парсером](#how-to-use)
7. [Превью парсинга](#example)

# Задание, стэк и структура

### <a name="task">Задание</a>

1. Зарегистрироваться на `https://rutracker.org/`.
2. Собрать данные о разделах и подразделах торрента. По ним разработать `mongoose` модели и записать их в БД.
3. Пройтись по одному из подразделов и получить посты с выложенными торрентами (около 100-200 шт), собрать:

    - название;
    - описание;
    - дату релиза (когда выложили на торрент);
    - никнейм автора;
    - magnet-ссылки;
    - ссылки на скачивание torrent-файла;
    - последних поблагодаривших + дату благодарности.

4. Положить данные постов в БД на основе соответствующей модели (или нескольких моделей).
5. Опционально, но необязательно:
    - вывести на фронт для просмотра.
    - упаковать в `docker-compose.yaml`

### <a name="stack">Стэк</a>

Для сервера:

-   `express` - базовый фреймворк для создания сервера
-   `mongoose` - ODM для управления MongoDB

Для парсера:

-   `puppeteer` - эмуляция браузера и загрузка HTML страницы
-   `cheerio` - поиск по тегам, классам и ID для формирования выходного JSON

### <a name="structure">Структура</a>

Проект имеет следующую структуру:

```
.
├── parser
│    ├── formatters     - классы JSON форматтеров
│    ├── loaders        - классы HTML загрузчиков
│    ├── out            - выходная папка для файлов JSON
│    └── utils          - функции парсера
├── server
│    ├── controllers    - контроллеры
│    ├── middlewares    - мидлвары
│    ├── models         - mongoose модели
│    ├── public         - папка для фронта
│    ├── routes         - роуты
│    └── utils          - функции сервера
├── .env                - переменные БД и сервера
├── .gitignore
├── .prettierrc.js      - конфиг Prettier'а
├── .puppeteerrc.js     - конфиг Puppeteer'а
├── app.js              - входной файл сервера
├── archive.gz          - дамп БД
├── database.js         - подключение к БД
├── docker-compose.yaml
├── Dockerfile          - dockerfile сервера
├── get-each-category.js
├── get-each-post-in-subcategory.js
├── package-lock.json
├── package.json
├── parser.config.js    - конфиг парсера
├── pm2.config.js       - конфиг pm2
├── README.md
└── server.config.js    - конфиг сервера
```

# Установка и запуск

Есть два способа запуска этого проекта:

1. npm-модуль `pm2`
2. `docker-compose`

### <a name="pm2">Запуск с помощью `pm2`</a>

> **Внимание:**
>
> В вашей системе уже должна быть работающая MongoDB

Клонируйте этот проект:

```bash
git clone https://github.com/ncioo/steadycontrol-test.git
```

Откройте папку клонированного проекта:

```bash
cd steadycontrol-test
```

Установите `npm` модули:

```bash
npm i
```

Установите `pm2` :

```bash
npm i pm2 -g
```

Запустите сервер:

```bash
pm2 start pm2.config.js
```

Вы запустите сервер на порту 4000. [Парсер запускается отдельно.](#how-to-use)

Восстановление дампа БД из архива:

```bash
mongorestore --gzip --archive=/archive.gz
```

### <a name="docker-compose">Запуск с помощью `docker-compose`</a>

Скопируйте файлы `docker-compose.yaml` и `archive.gz` в любую папку. Затем в этой папке запустите команду:

```bash
docker-compose up -d
```

Вы запустите контейнеры сервера - `server` и БД - `database`. [Парсер запускается отдельно.](#how-to-use)

Восстановление дампа БД из архива:

```bash
docker exec -it database mongorestore --gzip --archive=/archive.gz
```

## <a name="how-to-use">Как работать с парсером</a>

> **Внимание:**
>
> Если вы запустили сервер с помощью `docker-compose` - сначала нужно напрямую подключиться к контейнеру сервера:
>
> ```bash
> docker exec -it server bash
> ```

Парсер имеет условно две входные точки - файлы `get-each-category.js` и `get-each-post-in-subcategory.js`. По их названиям можно догадатся за что они отвечают.

Принцип работы:

1. Парсер заходит на страницу
2. Выделяет по классам или ID нужную часть HTML-страницы
3. Форматирует страницу и выделяет из нее нужные данные, которые затем преобразует в JSON
4. Записывает полученные данные в БД

---

Функция в файле `get-each-category.js` сначала получает все категории с главной страницы Рутрекера, затем переходит по каждой и получает ее подкатегории.

#### Результат: в БД попадут **ВСЕ** категории и **ВСЕ** подкатегории, существующие на Рутрекере.

Запуск парсинга всех категорий и подкатегорий:

```bash
node get-each-category.js
```

---

Функция в файле `get-each-post-in-subcategory.js` ожидает ввода валидного ID **подкатегории** (она должна существовать и иметь какие-либо посты). Если ID не введен - функция будет использовать ID по-умолчанию (`1426`), который хранится в файле `parser.config.js`. Так как подкатегория может содержать в себе сразу несколько страниц постов - было введено ограничение в 3 страницы (3х50 постов). Это число также регулируется в `parser.config.js`.

#### Результат: в БД попадут **ВСЕ** посты с выбранного количества страниц и **ВСЕ** пользователи - авторы главного поста и поблагодарившие.

> По-умолчанию выбрана [вот эта](https://rutracker.org/forum/viewforum.php?f=1426) подкатегория. С нее парсер собрал: **150 постов** и **2742 пользователя**

Запуск парсинга всех постов в конкретной подкатегории с ID - `1234`:

```bash
node get-each-post-in-subcategory.js id=1234
```

# <a name="example">Превью парсинга</a>

Вы можете найти **примеры** парсинга в папках `/parser/out/categories` и `/parser/out/posts`

Функция `get-each-category.js`:

<img src="https://i.imgur.com/F2nequB.gif" />

Функция `get-each-post-in-subcategory.js`:

<img src="https://i.imgur.com/L1RfLtA.gif" />
