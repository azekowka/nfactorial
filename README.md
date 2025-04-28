<p align="center" style="display: flex; align-items: center; justify-content: center; gap: 8px;">
  <img src="https://notion-emojis.s3-us-west-2.amazonaws.com/prod/svg-twitter/1f5fa-fe0f.svg" alt="Wanderlust Logo" width="40" height="40"/></br>
  <span style="font-size: 40px;">Wanderlust (World Map Tracker)</span>
</p>

## Краткое описание проекта
Это веб-приложение, позволяющее путешественникам отслеживать свои поездки и получать рекомендации, планы от ИИ на основе глубокого поиска.

## Установка и запуск

1. Клонируйте репозиторий:
   ```bash
   git clone https://github.com/azekowka/nfactorial.git
   ```

2. Установите зависимости:
   ```bash
   npm i
   ```

3. Запустите проект:
   ```bash
   npm run dev
   ```
4. Откройте проект локально:
   ```bash
   http://localhost:3000
   ```

## Деплоймент

Веб-приложение хостится на Vercel и доступно по следующей ссылке

> [https://wanderlust-nfactorial.vercel.app](https://wanderlust-nfactorial.vercel.app)

## Процесс разработки

User попадая на мое веб-приложение онбордится на лаконичном лэндинге, который сделан с помощью UI компонентов Aceternity. Авторизируется в систему через ClerkAuth и редиректится в дэшборд, иначе ему будет отказано в доступе. В дэшборде его встречают карточки с features (одна из них с Тайлер Дерденом):
1. Track Visited Places: Upstash и Redis позволяют сохранять Visited/Want to visit страны, выделяет их разными цветами и позволяет скачать SVG/PNG созданной карты.
2. Туризм LLM путеводитель: Встречает пользователя красивым UI, предлагает выбрать модель из предложенных семейсто Gemini и Groq, использовать Advanced Search (Tavily) с картинками и цитатами источников, сохраняет историю чатов, позволяет скопировать чат и поделиться ссылкой на чат.
3. Animate Travel Map: Поиск стран по ISO коду, отображение хочу/посетил стран на карте от MapBox, выбор emoji самолета, машины, человека которые динамично перемещаются по заданным странам, высчитать пройденную дистанцию, возможность ускорить и замедлить анимацию.

## Некоторые компромиссы
- Начну с деплоймента, совершал я его в последний оставшийся день и словил type, eslint, dependencies mismatch errors. От чего в попыхах исправлял деплой, убрал eslint и вручную пулл реквестами из deployment branch фиксил package.json & package-lock.json. В качестве компромисса, я бы предпочел npm run build-ить проект на начальных стадиях, чтобы решать эти проблемы попутно, а не тогда когда все готово =).
- Я не использовал предложеные темплейты из visitedplaces.com, вместо этого создавал карты и визуализацию через MapBox, DataMaps, Three.js, D3.js, Turf.js, с не менее понятной документацией у каждой.
- Из LLM-ок имплементировал Google AI Studio, Groq Console (Meta Llamas), поскольку остальные LLM провайдеры взымают некоторые суммы, но при необходимости можно их добавить, все через AI SDK.
- В чек-листе дополнительно сделать верстку респонсивной для мобильных устройств, добавить Vercel/PostHog Analytics {игнорируйте последние коммиты связанные с имплементацией =)}, привязать домен и ssl сертификат от партнеров Github Education Pack, улучшить SEO-оптимизацию в поисковых engines.
  
## Известные ошибки
- Groq ограничивает запросы, как видно в тексте ошибки: Request too large for model `meta-llama/llama-4-maverick-17b-128e-instruct` in organization `org_01jndhnschebht2mk2kchy7g6p` service tier `on_demand` on tokens per minute (TPM): Limit 6000, Requested 8543, please reduce your message size and try again. Need more tokens? Upgrade to Dev Tier today at https://console.groq.com/settings/billing
- Глубокий поиск с помощью Tavily перестал работать на продакшне, но отлично работает локально (на видео продемонстрировал)

## Технический стек

- **Frontend**: React, Next.js, TypeScript, TailwindCSS, PostCSS, Prettier, Aceternity UI, shadcn/ui
- **Backend и БД**: Next.js API Routes, Upstash, Redis
- **ИИ провайдеры**: Gemini (2.0 Flash, 2.0 Flask Thinking Exp., Gemini 2.5 Pro Exp.), Groq (Llama 4 Maverick 17B)
- **Карты и Визуализация**: MapBox (https://docs.mapbox.com/mapbox-gl-js/guides), DataMaps (https://datamaps.github.io/), Turf.js, D3.js, Three.js
- **Auth**: Clerk
