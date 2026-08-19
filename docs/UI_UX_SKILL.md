# UI/UX skill для PixelGame

В authoring-среде PixelGame установлен **UI/UX Pro Max**. Он применяется только к задачам, которые меняют интерфейс: композицию экранов, палитру, типографику, навигацию, доступность, responsive-поведение, анимации и UX-review. Он не применяется к backend-логике, базе данных, секретам, инфраструктуре или не-визуальным скриптам.

| Параметр | Значение |
|---|---|
| Локальный путь среды разработки | `/home/ubuntu/skills/ui-ux-pro-max` |
| Upstream | [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) |
| Закреплённая ревизия | `8a1a6d8` (shallow clone, 19 августа 2026 г.) |
| Лицензия upstream | MIT |
| Проверка установки | `scripts/search.py "gaming e-commerce retro" --design-system -p PixelGame` выполнилась без записи в проект |

## Практическое применение

Перед заметным UI/UX-изменением для PixelGame используйте целевой поиск по React или UX-направлению. Для нового крупного экрана либо полной переработки сначала получите design-system recommendation, а затем сопоставьте его с существующей ретро-аркадной системой PixelGame. Результаты являются рекомендациями: они не заменяют требования проекта, reduced-motion поддержку, доступность и проверку desktop/mobile.

> Не передавайте в поисковые запросы секреты, токены, персональные данные покупателей или закрытые данные проекта. Не запускайте режим `--persist` и не используйте `--force` без отдельного решения о том, что design-system файлы нужны в репозитории.

## Безопасное обновление

Новая версия skill сначала должна быть скачана в отдельный временный каталог и проверена до замены текущей локальной копии. Минимальная проверка включает review `SKILL.md`, статический поиск сетевых и shell-вызовов в runtime scripts и smoke-вызов `search.py` без `--persist`. Нельзя устанавливать skill через непроверенный npm install hook или выполнять сторонние скрипты вне явно согласованной области.

Полная инструкция upstream: [README](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/main/README.md). [1]

## Ссылки

[1]: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill "UI/UX Pro Max upstream repository"
