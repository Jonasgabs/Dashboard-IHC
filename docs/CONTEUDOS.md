## Link para a pasta com os conteúdos da cliente

    https://drive.google.com/drive/folders/1hwPVPtatb8_2UoZN78Z3EmbfQcrLhfu3


### Estrutura planejada

    /
    ├── backend/
    │   ├── src/
    │   │   ├── api/
    │   │   │   ├── routes/
    │   │   │   ├── controllers/
    │   │   │   └── schemas/
    │   │   ├── services/
    │   │   ├── db/
    │   │   ├── bots/
    │   │   └── main.py
    │   ├── tests/
    │   └── requirements.txt
    ├── frontend/
    │   ├── src/
    │   │   ├── components/
    │   │   ├── pages/
    │   │   ├── services/
    │   │   └── App.jsx
    │   └── tailwind.config.js
    ├── docs/
    ├── .env
    └── README.md


<!doctype html>
<html lang="pt-pt">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/png" href="/logo1.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Leading Prospect - Flavia Golveia</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
    <script type="module">
        import Swiper from 'swiper/bundle';
        import { Pagination } from 'swiper/modules';
        import 'swiper/css/bundle';
        import 'swiper/css/pagination';
        import 'swiper/css/effect-cards'

        const swiper = new Swiper('.proofSlides', {
            effect: "cube",
            cubeEffect : {
                slideShadows: false,
                shadow: false,
                shadowOffset: 20,
                shadowScale: 0.94,
            },
            loop: true,
            autoplay : {
                delay: 3000,
                duration : 500
            },
            grabCursor: true,
            modules: [Pagination],
            centeredSlides: true,
            pagination: {
                el: '.swiper-pagination',
            }
        });
    </script>
  </body>
</html>

## Inicializar db

    PYTHONPATH=$(pwd) python src/api/db/init_db.py