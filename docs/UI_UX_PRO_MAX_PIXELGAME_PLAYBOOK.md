# UI/UX Pro Max: применение к PixelGame

Этот playbook переводит рекомендации установленного UI/UX Pro Max в конкретные действия для существующей retro-arcade витрины PixelGame. Он не заменяет визуальную концепцию: характерные ЭЛТ-эффекты, phosphor mint, laser magenta и 80s arcade composition остаются основой интерфейса.

## 1. Как запускать guidance

PixelGame использует React 19, Vite и CSS visual system в `client/src/index.css`. Для каждого UI-изменения сначала выбирается **один** доминирующий вопрос, затем запускается соответствующий локальный поиск skill. Не следует сохранять design-system output в проект с `--persist` без отдельного решения: текущий visual system уже является source of truth.

```bash
SKILL=/home/ubuntu/skills/ui-ux-pro-max/scripts/search.py

# Новый крупный экран или визуальная переработка
python3 "$SKILL" "retro gaming digital marketplace" --design-system -p PixelGame -f markdown

# Диалог, drawer, клавиатурное управление, focus
python3 "$SKILL" "keyboard focus modal" --domain ux

# Карточки, чипы, редкость, длинные локализованные подписи
python3 "$SKILL" "badge chip label wraps" --domain ux

# Точечные правила React после UX-запроса
python3 "$SKILL" "accessibility focus" --stack react
```

> Результат skill — это **рекомендация**, а не команда к массовому редизайну. В частности, его системный поиск предлагает 3D/hyperrealism для gaming showcase, но PixelGame уже имеет более подходящую и цельную pixel/CRT эстетику. Из выдачи следует использовать иерархию, contrast, focus и responsive checks, но не заменять ими утверждённый retro-art direction.

## 2. Матрица текущих компонентов

| Компонент | Что уже есть | Как использовать guidance | Первый безопасный шаг |
|---|---|---|---|
| `StorefrontNav.tsx` | EN/RU, USD/EUR/RUB, тема, избранное, кабинет, корзина и aria-labels | Проверять touch area от 44×44 px, видимый `:focus-visible`, keyboard sequence и labels динамических счётчиков | Проверить desktop, 768 px и 375 px; не полагаться только на цвет active state. |
| `SearchAutocomplete.tsx` | Поиск по каталогу и переход к результатам | Запросить guidance для combobox/keyboard selection; проверить Enter, Escape, Arrow Up/Down и экранное объявление результата | Добавить regression test для клавиатурного выбора до visual rework. |
| `Home.tsx` + product cards | 4 товарные линии, rarity, game/category/price filters, hover и публичные artwork | Использовать правило «одно главное сообщение на карточку»; rarity должна читаться текстом, а не только цветом; проверить wrapping RU/EN | Проверить карточки со всеми пятью rarity на узкой ширине и при увеличенном шрифте. |
| `CartDrawer.tsx` | Количество, subtotal, retro confirmation `SIMULATED ONLY` | Применять правила modal focus: focus trap, Escape/close, возврат focus на trigger и отсутствие перекрытия sticky UI | Добавить browser test Tab/Escape только после ручной проверки доступности. |
| `Checkout.tsx` | Preview checkout, processing, `aria-busy`, confetti и success route | Проверять видимые labels, error message рядом с полем, несокрытый focus, объявление processing и reduced-motion для confetti | Проверить form при keyboard-only проходе и `prefers-reduced-motion`. |
| `index.css` | CRT scanlines, pixel hover, responsive breakpoints, reduced-motion gates | Сохранять animation через transform/opacity, контраст обеих тем, отсутcтвие horizontal overflow | Снимать screenshots на 375/768/1024/1440 px перед публикацией. |

## 3. Приоритеты для следующей UI-итерации

| Приоритет | Изменение | Почему это важно | Проверка готовности |
|---|---|---|---|
| **P0** | Полная keyboard/focus-проходка cart confirmation dialog | UX guidance прямо отмечает visible focus и focus not obscured как high severity для модальных элементов | Tab проходит по всем действиям; Escape закрывает окно; focus возвращается к кнопке корзины. |
| **P0** | Мобильные размеры интерактивных контролов nav/filter/cart | На touch-устройствах hover не является доступным affordance | Критичные элементы не меньше 44×44 px и имеют 8 px+ separation. |
| **P1** | Проверка contrast светлой темы и active rarity/filter states | PixelGame использует яркие CRT colors на нескольких фонах | Текст и состояние активного фильтра читаемы без опоры только на цвет. |
| **P1** | Resilient RU/EN text layout карточек и badge | RU-строки и длинные product titles могут занимать больше места | Нет clipping при 375 px, 200% zoom и 125% text scale. |
| **P2** | Единый motion budget для карточек, drawer и success state | Motion уже характерен для бренда, но не должен замедлять shopping flow | Hover 150–300 ms; modal/drawer 200–500 ms; все nonessential эффекты отключаются в reduced motion. |

## 4. Рабочий процесс перед каждым UI-коммитом

Сначала описывайте изменение одним наблюдаемым UX-результатом: например, «keyboard focus не закрывается confirmation overlay» или «rarity badge не переносит смысл только цветом». Затем выполните один domain query UI/UX Pro Max и, если нужен кодовый паттерн, один React-stack query. Не смешивайте несколько несвязанных запросов в одном поиске.

После реализации запускайте `pnpm check`, `pnpm test`, `pnpm verify:arcade-assets` и `PIXELGAME_STOREFRONT_URL=https://pixelgame.pro/ pnpm verify:production`. Для визуальных изменений добавляйте screenshots desktop и mobile; для модальных и keyboard-сценариев добавляйте отдельный browser regression test.

## 5. Граница ответственности skill

UI/UX Pro Max применим к тому, **как интерфейс выглядит, движется и управляется**. Он не принимает решения за коммерческую модель, OAuth, database schema, оплату, секреты, deployment и DNS. Для PixelGame он помогает выбирать компонентные паттерны и quality checks, а не заменяет существующие safety controls и project tests.

## Ссылки

[1]: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill "UI/UX Pro Max upstream"
[2]: https://github.com/softalex96-creator/PixelGame/blob/main/client/src/components/StorefrontNav.tsx "PixelGame navigation"
[3]: https://github.com/softalex96-creator/PixelGame/blob/main/client/src/components/CartDrawer.tsx "PixelGame cart drawer"
[4]: https://github.com/softalex96-creator/PixelGame/blob/main/client/src/pages/Checkout.tsx "PixelGame checkout"
[5]: https://github.com/softalex96-creator/PixelGame/blob/main/client/src/index.css "PixelGame visual system"
