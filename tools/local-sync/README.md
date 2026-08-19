# Локальная синхронизация PixelGame

Этот набор создаёт отдельную папку `PixelGame` внутри выбранного каталога `Project LevelUp` и синхронизирует её с веткой `main` репозитория `softalex96-creator/PixelGame`. По умолчанию проверка выполняется **раз в час**, пока компьютер включён. Набор никогда не запускает `git reset --hard`, не делает принудительный push и не перезаписывает локальные изменения.

> Если в локальной папке есть незакоммиченные изменения или локальные commits, синхронизация останавливается, пишет понятную запись в лог и ждёт ручного решения. Это защищает вашу работу от незаметной потери.

| Платформа | Установщик | Целевая папка по умолчанию | Планировщик |
|---|---|---|---|
| Windows | `install-pixelgame-auto-sync.ps1` | `C:\Users\<имя>\Documents\MANUS PROJECTS\Project LevelUp\PixelGame` | Windows Task Scheduler |
| macOS / Linux | `install-pixelgame-auto-sync.sh` | `~/Documents/MANUS PROJECTS/Project LevelUp/PixelGame` | `cron`, если он доступен |

## Windows: рекомендуемый порядок

1. Скачайте и распакуйте этот набор, например, в папку `Загрузки`.
2. Откройте **PowerShell** и выполните команду из распакованной папки:

   ```powershell
   powershell -NoProfile -ExecutionPolicy Bypass -File .\install-pixelgame-auto-sync.ps1
   ```

3. Скрипт проверит наличие Git, создаст локальный clone в `C:\Users\admin\Documents\MANUS PROJECTS\Project LevelUp\PixelGame`, выполнит первую синхронизацию и зарегистрирует задачу `PixelGame GitHub Sync` с интервалом один час.

Чтобы использовать другой путь, передайте его явно:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\install-pixelgame-auto-sync.ps1 -ProjectPath "D:\Projects\PixelGame"
```

Логи находятся в `%LOCALAPPDATA%\PixelGame\sync\pixelgame-sync.log`. Однократную синхронизацию можно вручную запустить из папки clone:

```powershell
.\tools\local-sync\sync-pixelgame.ps1
```

Чтобы остановить автоматику, выполните:

```powershell
Unregister-ScheduledTask -TaskName "PixelGame GitHub Sync" -Confirm:$false
```

## macOS / Linux

```bash
chmod +x ./install-pixelgame-auto-sync.sh
./install-pixelgame-auto-sync.sh
```

Для другого пути укажите его первым аргументом:

```bash
./install-pixelgame-auto-sync.sh "$HOME/Documents/MANUS PROJECTS/Project LevelUp/PixelGame"
```

Скрипт добавляет одну ежечасную запись в пользовательский `crontab`, если `crontab` доступен. Логи записываются в `${XDG_STATE_HOME:-$HOME/.local/state}/pixelgame/pixelgame-sync.log`. Чтобы удалить cron-задачу, откройте `crontab -e` и удалите строку с комментарием `PixelGame GitHub Sync`.

## Восстановление после паузы, удаления или повреждения

Если задача была остановлена, просто запустите тот же installer снова: он проверит существующий официальный clone, выполнит безопасную синхронизацию и заново зарегистрирует scheduler. Если папка `PixelGame` была удалена, создайте или оставьте пустой родительский каталог `Project LevelUp`, затем снова запустите installer — он скачает чистый clone из GitHub.

Если Git сообщает о повреждённом репозитории либо origin отличается от официального, **не выполняйте reset или принудительную очистку**. Сначала скопируйте любые важные локальные файлы из `PixelGame` в отдельную папку. Затем переименуйте проблемную папку, например в `PixelGame-recovery-YYYY-MM-DD`, и запустите installer повторно. Он создаст новый проверенный clone и новую задачу scheduler; после этого можно вручную перенести нужные локальные файлы и сохранить их отдельным commit.

| Состояние | Безопасное восстановление |
|---|---|
| Автосинхронизация выключена | Повторно выполните installer; существующая задача будет создана заново. |
| Папка `PixelGame` удалена | Повторно выполните installer в исходном пути; будет создан clean clone. |
| Папка повреждена или remote изменён | Сохраните нужные файлы вне clone, переименуйте проблемную папку, затем выполните installer. |
| Есть незакоммиченные локальные изменения | Не удаляйте clone; сначала commit или перенесите файлы, затем запустите sync. |

## Разрешение остановленной синхронизации

| Сообщение в логе | Причина | Безопасное действие |
|---|---|---|
| `SKIPPED: uncommitted local changes` | В папке clone есть незакоммиченные файлы | Сохраните изменения в собственный commit либо перенесите их в отдельную папку; затем запустите sync вручную. |
| `SKIPPED: local commits are ahead of origin/main` | Локальная история отличается от GitHub | Отправьте свои commits в отдельную ветку или согласуйте их, прежде чем продолжать. |
| `STOPPED: unexpected origin` | Папка привязана не к официальному PixelGame remote | Не меняйте remote вслепую; проверьте путь и создайте новый clone при необходимости. |
| `ERROR: Git is not available` | Git не установлен или не найден в PATH | Установите Git с [git-scm.com](https://git-scm.com/downloads), перезапустите терминал и запустите installer повторно. |

## Ограничения

Автоматическое обновление происходит с периодичностью, выбранной локальным планировщиком; оно не получает мгновенное событие из GitHub. Если компьютер выключен или находится в длительном сне, следующая попытка произойдёт после его включения и следующего запуска планировщика. Исходником истины остаётся `main` на GitHub, а автоматический pull выполняется только как fast-forward merge.
