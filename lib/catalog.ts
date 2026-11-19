export const entries = [
  {
    slug: "invite-people",
    useCases: [
      "В настройках проекта администратор вводит почту дизайнера. Приложение отправляет приглашение через onInvite, а при ошибке адрес остаётся в форме.",
      "При создании команды организатор видит уже добавленных коллег и проверяет список перед следующим приглашением.",
    ],
    title: "Invite People",
    category: "Ввод",
    description:
      "Приглашение по email с проверкой адреса и обновлением списка участников.",
    gesture: "Введите адрес и пригласите участника",
    usage: "<InvitePeople members={[{ name: \"Sam\", email: \"sam@example.com\" }]} />",
    references: [
      {
        id: "db-invite-people",
        name: "Invite people",
      },
    ],
    symbol: "InvitePeople",
  },
  {
    slug: "focus-mode",
    useCases: [
      "Перед разбором макета дизайнер включает 25-минутную сессию. Стопка уведомлений сворачивается, а таймер показывает оставшееся время.",
      "В учебном кабинете студент включает фокус на время упражнения. Приложение использует onChange, чтобы приостановить собственные всплывающие уведомления.",
    ],
    title: "Focus Mode",
    category: "Карточки",
    description: "Уведомления сворачиваются, пока идёт сессия фокуса.",
    gesture: "Включите режим фокуса",
    usage: "<FocusMode minutes={25} notifications={[{ title: \"Review\", body: \"PR #24\", time: \"10:00\" }]} />",
    references: [
      {
        id: "db-focus-mode",
        name: "Focus mode",
      },
    ],
    symbol: "FocusMode",
  },
  {
    slug: "swipe-deck",
    useCases: [
      "В портфолио посетитель листает серию постеров по одному, не покидая страницу проекта.",
      "При отборе обложек редактор смахивает вариант вправо, чтобы добавить его в подборку. Приложение сохраняет карточку и направление из onSwipe.",
    ],
    title: "Swipe Deck",
    category: "Карточки",
    description:
      "Стопка арт-принтов следует за жестом и раскрывает следующий постер.",
    gesture: "Смахните или нажмите",
    usage: "<SwipeDeck cards={[{ title: \"Orbit\", color: \"#bed5ce\", ink: \"#20312a\" }, { title: \"Fold\", color: \"#dbcfbd\", ink: \"#30271c\" }]} />",
    references: [
      {
        id: "db-swipe-deck",
        name: "Swipe deck",
      },
    ],
    symbol: "SwipeDeck",
  },
  {
    slug: "glass-player",
    useCases: [
      "На странице урока студент перематывает аудиообъяснение к пропущенной фразе.",
      "В каталоге музыки покупатель слушает фрагмент трека и включает повтор, чтобы сравнить аранжировку с другим вариантом.",
    ],
    title: "Glass Player",
    category: "Карточки",
    description:
      "Аудиоплеер с обложкой, перемоткой, повтором и отключением звука.",
    gesture: "Включите трек и перемотайте его",
    usage: "<GlassPlayer src=\"/audio/intro.mp3\" title=\"Введение\" />",
    references: [
      {
        id: "liquid-glass-card",
        name: "Glass player",
      },
    ],
    symbol: "GlassPlayer",
  },
  {
    slug: "stat-card",
    useCases: [
      "На панели редакции сотрудник переключает просмотры с дней на недели, чтобы увидеть изменение аудитории.",
      "В отчёте службы поддержки руководитель выбирает точку на графике, чтобы прочитать число обращений за конкретный период.",
    ],
    title: "Stat Card",
    category: "Карточки",
    description:
      "График показывает значение в выбранной точке и меняет период.",
    gesture: "Переключите вид графика и выберите точку",
    usage: "<StatCard label=\"P95\" daily={[82, 91, 85]} weekly={[88, 84, 82]} />",
    references: [
      {
        id: "db-stat-card",
        name: "Stat card",
      },
    ],
    symbol: "StatCard",
  },
  {
    slug: "magnetic-button",
    useCases: [
      "На главной странице студии посетитель нажимает «Открыть портфолио». Переход к работам задаёт приложение через onClick.",
      "В финале интерактивной презентации кнопка «Попробовать демо» реагирует на приближение указателя и открывает демо по нажатию.",
    ],
    title: "Magnetic Button",
    category: "Кнопки",
    description: "Кнопка тянется за курсором и мягко возвращается на место.",
    gesture: "Наведите курсор",
    usage:
      '<MagneticButton onClick={() => console.log("click")}>Открыть</MagneticButton>',
    references: [
      {
        id: "db-magnetic-button",
        name: "Magnetic button",
      },
    ],
    symbol: "MagneticButton",
  },
  {
    slug: "plan-switch",
    useCases: [
      "На странице тарифов покупатель сравнивает стоимость месяца и итог за год перед оформлением подписки.",
      "При продлении подписки клиент меняет период оплаты. Приложение использует выбранный индекс, чтобы передать нужный тариф в checkout.",
    ],
    title: "Plan Switch",
    category: "Карточки",
    description:
      "Переключение периода пересчитывает месячную стоимость, итог и скидку.",
    gesture: "Смените период оплаты",
    usage: "<PlanSwitch options={[\"Месяц\", \"Год\"]} prices={[{ monthly: 20, total: 20 }, { monthly: 15, total: 180 }]} />",
    references: [
      {
        id: "db-plan-switch",
        name: "Plan switch",
      },
    ],
    symbol: "PlanSwitch",
  },
  {
    slug: "wave-slider",
    useCases: [
      "В плеере слушатель выставляет громкость по шкале от 0 до 100. Приложение преобразует процент в уровень звука.",
      "В редакторе фонового звука пользователь загружает сохранённый уровень в value и слышит изменение при перемещении ползунка.",
    ],
    title: "Wave Slider",
    category: "Ввод",
    description:
      "Компактная регулировка громкости с запоминанием уровня при отключении звука.",
    gesture: "Переместите бегунок или нажмите динамик",
    usage: "<WaveSlider defaultValue={60} onValueChange={console.log} />",
    references: [
      {
        id: "db-range-slider",
        name: "Range slider",
      },
    ],
    symbol: "WaveSlider",
  },
  {
    slug: "flip-counter",
    useCases: [
      "При бронировании стола гость добавляет участников. Верхняя граница счётчика соответствует вместимости стола.",
      "В заказе печати клиент меняет число экземпляров. Приложение пересчитывает смету из нового значения счётчика.",
    ],
    title: "Flip Counter",
    category: "Ввод",
    description: "Цифры перекатываются при каждом шаге счётчика.",
    gesture: "Измените значение",
    usage: "<FlipCounter defaultValue={12} min={0} max={99} />",
    references: [
      {
        id: "db-number-stepper",
        name: "Number stepper",
      },
    ],
    symbol: "FlipCounter",
  },
  {
    slug: "hold-button",
    useCases: [
      "Перед очисткой черновика автор удерживает кнопку до подтверждения. Если отпустить её раньше, текст остаётся на месте.",
      "На экране терминала оператор удерживает кнопку сброса сеанса. Приложение начинает сброс после onConfirm.",
    ],
    title: "Hold to Confirm",
    category: "Кнопки",
    description: "Удержание заполняет кнопку и подтверждает действие.",
    gesture: "Нажмите и удерживайте",
    usage:
      "<HoldButton duration={800} onConfirm={() => console.log('done')} />",
    references: [
      {
        id: "hold-button",
        name: "Hold button",
      },
    ],
    symbol: "HoldButton",
  },
  {
    slug: "spring-dock",
    useCases: [
      "В редакторе макетов дизайнер выбирает инструмент по иконке. Приложение связывает индекс кнопки с инструментом холста.",
      "В кабинете автора нижняя панель ведёт в библиотеку, черновики и публикации. При смене раздела активная иконка выделяется.",
    ],
    title: "Spring Dock",
    category: "Навигация",
    description: "Активная подложка скользит за выбранным пунктом.",
    gesture: "Выберите раздел",
    usage: "<SpringDock onChange={(index) => console.log(index)} />",
    references: [
      {
        id: "db-bottom-bar",
        name: "Bottom bar",
      },
    ],
    symbol: "SpringDock",
  },
  {
    slug: "file-drop",
    useCases: [
      "При создании обращения клиент перетаскивает скриншоты. Форма получает объекты File и прикладывает их к запросу при отправке.",
      "В редакторе галереи автор выбирает изображения с диска. Приложение строит предпросмотр из выбранных файлов до загрузки.",
    ],
    title: "File Drop",
    category: "Ввод",
    description:
      "Папка принимает файлы и показывает список с размером каждого.",
    gesture: "Перетащите файл или выберите с диска",
    usage: "<FileDrop onFiles={(files) => console.info(files.map(file => file.name))} />",
    references: [
      {
        id: "db-file-drop",
        name: "File drop",
      },
    ],
    symbol: "FileDrop",
  },
  {
    slug: "rolling-text",
    useCases: [
      "На выставочном стенде посетитель нажимает на приветствие и читает его на следующем языке.",
      "В образце фирменного шрифта дизайнер перелистывает короткие слова стрелками и сравнивает начертание букв.",
    ],
    title: "Rolling Text",
    category: "Текст",
    description: "Буквы нового слова по очереди вкатываются в строку.",
    gesture: "Нажмите на слово",
    usage: '<RollingText words={["Привет", "Bonjour", "Hello"]} />',
    references: [
      {
        id: "db-word-roll",
        name: "Word roll",
      },
    ],
    symbol: "RollingText",
  },
  {
    slug: "spring-switch",
    useCases: [
      "В настройках профиля пользователь включает уведомления. Приложение сохраняет флаг и восстанавливает его при следующем входе.",
      "В редакторе макета пользователь временно включает сетку. Локальный переключатель сообщает холсту, когда показать направляющие.",
    ],
    title: "Spring Switch",
    category: "Ввод",
    description: "Пружинный переключатель для двоичных настроек.",
    gesture: "Переключите состояние",
    usage: '<SpringSwitch label="Уведомления" onCheckedChange={console.log} />',
    references: [
      {
        id: "db-toggle-switch",
        name: "Toggle switch",
      },
    ],
    symbol: "SpringSwitch",
  },
  {
    slug: "bloom-menu",
    useCases: [
      "Рядом с выбранной фигурой дизайнер раскрывает действия дублирования и удаления, затем применяет одно к фигуре.",
      "На карточке фотографии редактор открывает компактное меню, чтобы скачать оригинал или скопировать ссылку через обработчик приложения.",
    ],
    title: "Bloom Menu",
    category: "Кнопки",
    description: "Меню раскрывает действия веером вокруг кнопки.",
    gesture: "Раскройте меню",
    usage: "<BloomMenu onSelect={(action) => console.log(action)} />",
    references: [
      {
        id: "db-goo-menu",
        name: "Goo menu",
      },
    ],
    symbol: "BloomMenu",
  },
  {
    slug: "morph-tooltip",
    useCases: [
      "В списке материалов читатель открывает действия статьи и добавляет её в закладки для чтения позже.",
      "На доске исследований участник закрепляет важный материал. Приложение обрабатывает действие pin для выбранной записи.",
    ],
    title: "Morph Tooltip",
    category: "Навигация",
    description: "Наведите курсор или переведите фокус",
    gesture: "Наведите курсор или переведите фокус",
    usage: "<MorphTooltip label=\"Статья\" onAction={(action) => console.info(action)} />",
    references: [
      {
        id: "db-morph-tooltip",
        name: "Morph tooltip",
      },
    ],
    symbol: "MorphTooltip",
  },
  {
    slug: "command-button",
    useCases: [
      "В предпросмотре накладной оператор запускает печать одной кнопкой. Приложение вызывает диалог печати в onExecute.",
      "В демонстрации команд разработчик повторно запускает одну операцию и видит, сколько раз её вызвал.",
    ],
    title: "Command Button",
    category: "Кнопки",
    description: "Выполните команду",
    gesture: "Нажмите кнопку или ⌘ / Ctrl + Enter",
    usage: "<CommandButton label=\"Печать\" onExecute={() => window.print()} />",
    references: [
      {
        id: "command-button",
        name: "Command button",
      },
    ],
    symbol: "CommandButton",
  },
  {
    slug: "loading-success",
    useCases: [
      "В настройках интеграции администратор проверяет соединение. Кнопка ждёт ответ сервера и предлагает повторить проверку при ошибке.",
      "В отчёте аналитик запускает синхронизацию и видит подтверждение после завершения запроса.",
    ],
    title: "Loading Success",
    category: "Кнопки",
    description: "Запустите действие и дождитесь результата",
    gesture: "Запустите действие и дождитесь результата",
    usage: "<LoadingSuccess onRun={async () => { const response = await fetch(\"/api/status\"); if (!response.ok) throw new Error(\"HTTP \" + response.status); }} />",
    references: [
      {
        id: "db-loading-success",
        name: "Loading to success",
      },
    ],
    symbol: "LoadingSuccess",
  },
  {
    slug: "copy-button",
    useCases: [
      "В документации разработчик копирует команду установки целиком и вставляет её в терминал.",
      "На странице заказа клиент копирует номер обращения для письма в поддержку и получает подтверждение копирования.",
    ],
    title: "Copy Button",
    category: "Кнопки",
    description: "Скопируйте текст",
    gesture: "Скопируйте текст",
    usage: "<CopyButton text=\"bun run build\" />",
    references: [
      {
        id: "db-copy-button",
        name: "Copy button",
      },
    ],
    symbol: "CopyButton",
  },
  {
    slug: "like-burst",
    useCases: [
      "В ленте сообщества читатель отмечает понравившийся пост и сразу видит изменение счётчика.",
      "На странице иллюстрации зритель снимает свою отметку повторным нажатием. Приложение сохраняет новый флаг через onChange.",
    ],
    title: "Like Burst",
    category: "Кнопки",
    description: "Поставьте или снимите отметку",
    gesture: "Поставьте или снимите отметку",
    usage: "<LikeBurst likes={12} />",
    references: [
      {
        id: "db-like-burst",
        name: "Like burst",
      },
    ],
    symbol: "LikeBurst",
  },
  {
    slug: "slide-to-confirm",
    useCases: [
      "На упаковочном столе сотрудник сдвигает подтверждение после проверки посылки. Приложение помечает её готовой к отправке.",
      "В мобильном терминале оператор завершает смену протяжённым жестом, чтобы случайное касание не запустило закрытие.",
    ],
    title: "Slide To Confirm",
    category: "Кнопки",
    description:
      "Подтверждение выполняется в конце хода. Незавершённый жест возвращает бегунок.",
    gesture: "Сдвиньте ползунок до конца",
    usage: "<SlideToConfirm onConfirm={() => window.print()} />",
    references: [
      {
        id: "slide-to-confirm",
        name: "Slide to confirm",
      },
    ],
    symbol: "SlideToConfirm",
  },
  {
    slug: "cart-button",
    useCases: [
      "В каталоге принтов покупатель добавляет первый экземпляр и меняет количество прямо в карточке товара.",
      "В киоске мерча покупатель убирает лишний экземпляр. Приложение получает итоговое количество и обновляет сумму заказа.",
    ],
    title: "Cart Button",
    category: "Карточки",
    description:
      "Раскрывающаяся корзина с количеством товаров и пересчётом суммы.",
    gesture: "Добавьте товар в корзину",
    usage: "<CartButton title=\"Studio Print\" price={32} />",
    references: [
      {
        id: "cart-button",
        name: "Cart button",
      },
    ],
    symbol: "CartButton",
  },
  {
    slug: "undo-button",
    useCases: [
      "В списке черновиков автор убирает запись и сразу возвращает её, если выбрал соседнюю строку.",
      "В подборке материалов редактор временно исключает статью. Приложение меняет видимость записи и поддерживает отмену.",
    ],
    title: "Undo Button",
    category: "Кнопки",
    description: "Удалите запись и верните её",
    gesture: "Удалите запись и верните её",
    usage: "<UndoButton label=\"Черновик\" onChange={(removed) => console.info({ removed })} />",
    references: [
      {
        id: "undo-button",
        name: "Undo button",
      },
    ],
    symbol: "UndoButton",
  },
  {
    slug: "bell-button",
    useCases: [
      "На странице проекта участник подписывается на обновления и повторным нажатием отключает подписку.",
      "На странице трансляции зритель включает напоминание. Приложение использует новый флаг, чтобы запланировать уведомление.",
    ],
    title: "Bell Button",
    category: "Кнопки",
    description: "Переключите оповещения",
    gesture: "Переключите оповещения",
    usage: "<BellButton onChange={(enabled) => localStorage.setItem(\"alerts\", String(enabled))} />",
    references: [
      {
        id: "bell-button",
        name: "Bell button",
      },
    ],
    symbol: "BellButton",
  },
  {
    slug: "unlock-face-id",
    useCases: [
      "В интерактивном прототипе заказчик проходит демонстрационное сканирование и видит состояние открытого файла.",
      "В интерфейсе защищённого хранилища пользователь начинает проверку. Приложение запускает свой механизм аутентификации и передаёт его результат в status.",
    ],
    title: "Unlock Face ID",
    category: "Карточки",
    description: "Запустите демонстрацию сканирования",
    gesture: "Запустите демонстрацию сканирования",
    usage: "<UnlockFaceId onDemoComplete={() => console.info(\"Demo complete\")} />",
    references: [
      {
        id: "unlock-face-id",
        name: "Unlock Face ID",
      },
    ],
    symbol: "UnlockFaceId",
  },
  {
    slug: "spring-dropdown",
    useCases: [
      "В редакторе иллюстраций автор выбирает формат файла из короткого списка перед экспортом.",
      "В списке заказов менеджер выбирает режим сортировки. Приложение получает название варианта и перестраивает список.",
    ],
    title: "Spring Dropdown",
    category: "Ввод",
    description: "Раскройте список и выберите статус",
    gesture: "Раскройте список и выберите статус",
    usage: "<SpringDropdown options={[\"PNG\", \"WebP\", \"SVG\"]} />",
    references: [
      {
        id: "db-spring-dropdown",
        name: "Spring dropdown",
      },
    ],
    symbol: "SpringDropdown",
  },
  {
    slug: "morph-island",
    useCases: [
      "В прототипе входящего звонка пользователь принимает или отклоняет вызов. Приложение получает решение через onCall.",
      "На презентации мобильного интерфейса дизайнер переключает встроенные активности, чтобы показать таймер и ход операции в одной компактной панели.",
    ],
    title: "Morph Island",
    category: "Карточки",
    description: "Панель для таймера, экспорта и входящего звонка.",
    gesture: "Выберите таймер, экспорт или звонок",
    usage: "<MorphIsland title=\"Studio\" onCall={(accepted) => console.info({ accepted })} />",
    references: [
      {
        id: "db-morph-island",
        name: "Morph island",
      },
    ],
    symbol: "MorphIsland",
  },
  {
    slug: "tab-pill",
    useCases: [
      "В инструкции по установке разработчик переключается между вкладками API и CLI, чтобы прочитать нужный фрагмент.",
      "В описании материала покупатель открывает вкладку ухода рядом с характеристиками, сохраняя место на странице товара.",
    ],
    title: "Tab Pill",
    category: "Навигация",
    description: "Переключите вкладку",
    gesture: "Переключите вкладку",
    usage: "<TabPill options={[\"API\", \"CLI\"]} panels={[\"POST /messages\", \"bun run build\"]} />",
    references: [
      {
        id: "db-tab-pill",
        name: "Tab pill",
      },
    ],
    symbol: "TabPill",
  },
  {
    slug: "segmented-control",
    useCases: [
      "В отчёте производительности аналитик переключает p50 и p95. Приложение подставляет ряд для выбранного показателя.",
      "В менеджере файлов пользователь выбирает плитки или список. Приложение меняет представление тех же файлов.",
    ],
    title: "Segmented Control",
    category: "Навигация",
    description: "Выберите период",
    gesture: "Выберите период",
    usage: "<SegmentedControl options={[\"p50\", \"p95\", \"p99\"]} />",
    references: [
      {
        id: "db-segmented-control",
        name: "Segmented control",
      },
    ],
    symbol: "SegmentedControl",
  },
  {
    slug: "rubber-dock",
    useCases: [
      "В оболочке рабочего пространства пользователь переходит из файлов в календарь через встроенную панель из четырёх разделов.",
      "В прототипе мобильного рабочего стола дизайнер проводит по панели, просматривает подписи и выбирает раздел фотографий.",
    ],
    title: "Rubber Dock",
    category: "Навигация",
    description: "Проведите по иконкам",
    gesture: "Проведите по иконкам",
    usage: "<RubberDock onSelect={(index) => console.info({ index })} />",
    references: [
      {
        id: "db-rubber-dock",
        name: "Rubber dock",
      },
    ],
    symbol: "RubberDock",
  },
  {
    slug: "dynamic-menu",
    useCases: [
      "В редакторе диаграмм автор раскрывает подменю экспорта и выбирает SVG. Приложение запускает нужный экспортёр.",
      "В конструкторе отчётов аналитик открывает список форматов, возвращается на уровень выше и снова выбирает способ выгрузки.",
    ],
    title: "Dynamic Menu",
    category: "Навигация",
    description: "Откройте меню и вложенный раздел",
    gesture: "Откройте меню и вложенный раздел",
    usage: "<DynamicMenu formats={[\"PNG\", \"WebP\"]} />",
    references: [
      {
        id: "db-dynamic-menu",
        name: "Dynamic menu",
      },
    ],
    symbol: "DynamicMenu",
  },
  {
    slug: "sidebar-collapse",
    useCases: [
      "В рабочем пространстве дизайнер сворачивает навигацию, чтобы освободить место для макета, сохраняя доступ к двум разделам.",
      "В кабинете студии сотрудник выбирает проекты или коллекции. Приложение переключает содержимое по индексу раздела.",
    ],
    title: "Sidebar Collapse",
    category: "Навигация",
    description:
      "Боковая навигация студии с рабочей областью выбранного раздела.",
    gesture: "Смените раздел и сверните панель",
    usage: "<SidebarCollapse items={[\"Проекты\", \"Команда\"]} />",
    references: [
      {
        id: "db-sidebar-collapse",
        name: "Sidebar collapse",
      },
    ],
    symbol: "SidebarCollapse",
  },
  {
    slug: "pagination-dots",
    useCases: [
      "В галерее товара покупатель переходит к нужной фотографии по точке под изображением.",
      "Во вводном туре пользователь переходит к последнему экрану с клавиатуры. Приложение показывает слайд с выбранным индексом.",
    ],
    title: "Pagination Dots",
    category: "Навигация",
    description: "Перейдите к другой странице",
    gesture: "Перейдите к другой странице",
    usage: "<PaginationDots pages={5} />",
    references: [
      {
        id: "db-pagination-dots",
        name: "Pagination dots",
      },
    ],
    symbol: "PaginationDots",
  },
  {
    slug: "command-palette",
    useCases: [
      "В редакторе пользователь набирает часть названия команды и запускает найденное действие клавишей Enter.",
      "В админке оператор находит среди команд переход к очереди заявок. Приложение сопоставляет выбранное название с маршрутом.",
    ],
    task: "Найти и выполнить действие из известного списка команд.",
    title: "Command Palette",
    category: "Навигация",
    description: "Найдите и выполните команду",
    gesture: "Найдите и выполните команду",
    usage: "<CommandPalette commands={[\"Печать\"]} onExecute={() => window.print()} />",
    references: [
      {
        id: "db-command-palette",
        name: "Command palette",
      },
    ],
    symbol: "CommandPalette",
  },
  {
    slug: "step-progress",
    useCases: [
      "При оформлении заявки клиент проходит шаги контактов, параметров и проверки. Приложение показывает поля выбранного шага.",
      "В мастере настройки администратор возвращается к пронумерованному шагу, чтобы исправить параметры перед завершением.",
    ],
    title: "Step Progress",
    category: "Навигация",
    description: "Перейдите к следующему этапу",
    gesture: "Перейдите к следующему этапу",
    usage: "<StepProgress steps={[\"Черновик\", \"Проверка\", \"Готово\"]} />",
    references: [
      {
        id: "db-step-progress",
        name: "Step progress",
      },
    ],
    symbol: "StepProgress",
  },
  {
    slug: "toolbar",
    useCases: [
      "В редакторе заметки автор включает жирное начертание и курсив и сразу видит их сочетание на образце текста.",
      "В конструкторе шаблонов дизайнер снимает отдельный стиль. Приложение получает полный набор оставшихся стилей для выбранной надписи.",
    ],
    title: "Toolbar",
    category: "Навигация",
    description: "Включите стили текста",
    gesture: "Включите стили текста",
    usage: "<Toolbar text=\"Заметка редактора\" />",
    references: [
      {
        id: "toolbar",
        name: "Toolbar",
      },
    ],
    symbol: "Toolbar",
  },
  {
    slug: "morph-popover",
    useCases: [
      "Читатель замечает ошибку в документации и отправляет замечание из небольшой формы рядом со статьёй.",
      "При ревью макета дизайнер оставляет короткий комментарий. Если сервис недоступен, автор повторяет отправку из той же формы.",
    ],
    title: "Morph Popover",
    category: "Кнопки",
    description: "Оставьте отзыв: кнопка развернётся в форму",
    gesture: "Оставьте отзыв: кнопка развернётся в форму",
    usage: "<MorphPopover title=\"Обратная связь\" onSubmit={text => localStorage.setItem(\"feedback\", text)} />",
    references: [
      {
        id: "morph-popover",
        name: "Morph popover",
      },
    ],
    symbol: "MorphPopover",
  },
  {
    slug: "letter-limit",
    useCases: [
      "В профиле автор сокращает биографию под лимит площадки и видит, сколько символов уже занял.",
      "При подготовке короткой подписи редактор вставляет текст с эмодзи. Поле соблюдает лимит, сохраняя составные символы целиком.",
    ],
    title: "Letter Limit",
    category: "Ввод",
    description: "Введите текст до лимита",
    gesture: "Введите текст до лимита",
    usage: "<LetterLimit label=\"Bio\" limit={160} />",
    references: [
      {
        id: "db-letter-limit",
        name: "Letter limit",
      },
    ],
    symbol: "LetterLimit",
  },
  {
    slug: "springy-input",
    useCases: [
      "В базе знаний сотрудник вводит вопрос и отправляет его клавишей Enter. Приложение открывает страницу результатов.",
      "В каталоге образцов дизайнер вводит часть названия. Приложение использует onChange, чтобы отфильтровать образцы по мере ввода.",
    ],
    title: "Springy Input",
    category: "Ввод",
    description: "Нажмите на поле и начните ввод",
    gesture: "Нажмите на поле и начните ввод",
    usage: "<SpringyInput placeholder=\"Поиск по проекту\" onSubmit={query => location.assign(\"/search?q=\" + encodeURIComponent(query))} />",
    references: [
      {
        id: "db-springy-input",
        name: "Springy input",
      },
    ],
    symbol: "SpringyInput",
  },
  {
    slug: "otp-code",
    useCases: [
      "При входе пользователь вставляет одноразовый код из сообщения. Заполненный код приложение отправляет на проверку целиком, включая начальные нули.",
      "При подтверждении новой почты пользователь вводит четыре цифры. Приложение задаёт длину поля под формат своего кода подтверждения.",
    ],
    title: "OTP Code",
    category: "Ввод",
    description: "Введите или вставьте цифровой код",
    gesture: "Введите или вставьте цифровой код",
    usage: "<OtpCode length={6} />",
    references: [
      {
        id: "db-otp-code",
        name: "OTP code",
      },
    ],
    symbol: "OtpCode",
  },
  {
    slug: "star-rating",
    useCases: [
      "После занятия студент ставит оценку уроку. Приложение привязывает выбранное число звёзд к этому занятию.",
      "В каталоге прототипов участник оценивает каждый вариант. Приложение собирает оценки для последующего сравнения.",
    ],
    title: "Star Rating",
    category: "Ввод",
    description: "Оцените от одной до пяти звёзд",
    gesture: "Оцените от одной до пяти звёзд",
    usage: "<StarRating onChange={stars => localStorage.setItem(\"rating\", String(stars))} />",
    references: [
      {
        id: "db-star-rating",
        name: "Star rating",
      },
    ],
    symbol: "StarRating",
  },
  {
    slug: "tag-input",
    useCases: [
      "Перед публикацией статьи редактор добавляет темы и удаляет случайный тег, затем сохраняет итоговый список.",
      "В медиатеке сотрудник открывает карточку с уже заданными ключевыми словами и дополняет их для будущего поиска.",
    ],
    title: "Tag Input",
    category: "Ввод",
    description: "Введите метку и нажмите Enter",
    gesture: "Введите метку и нажмите Enter",
    usage: "<TagInput initial={[\"design\", \"review\"]} />",
    references: [
      {
        id: "db-tag-input",
        name: "Tag input",
      },
    ],
    symbol: "TagInput",
  },
  {
    slug: "password-strength",
    useCases: [
      "При регистрации пользователь видит, как локальная оценка меняется по мере ввода нового пароля.",
      "В форме смены пароля пользователь улучшает комбинацию до отправки. Приложение применяет собственные правила при сохранении.",
    ],
    title: "Password Strength",
    category: "Ввод",
    description: "Проверьте индикатор при вводе",
    gesture: "Проверьте индикатор при вводе",
    usage: "<PasswordStrength onChange={password => console.info({ length: password.length })} />",
    references: [
      {
        id: "db-password-strength",
        name: "Password strength",
      },
    ],
    symbol: "PasswordStrength",
  },
  {
    slug: "checkbox-list",
    useCases: [
      "При экспорте отчёта аналитик отмечает несколько включаемых разделов. Приложение формирует файл из выбранных пунктов.",
      "В настройках рассылки подписчик выбирает интересующие темы и сохраняет несколько предпочтений за один раз.",
    ],
    title: "Checkbox List",
    category: "Ввод",
    description: "Отметьте выполненные пункты",
    gesture: "Отметьте выполненные пункты",
    usage: "<CheckboxList items={[\"Lint\", \"Build\", \"Review\"]} />",
    references: [
      {
        id: "db-checkbox-list",
        name: "Checkbox list",
      },
    ],
    symbol: "CheckboxList",
  },
  {
    slug: "jelly-slider",
    useCases: [
      "В редакторе стикеров дизайнер двигает ползунок прозрачности. Приложение применяет выбранный процент к стикеру.",
      "В демо анимации посетитель меняет интенсивность эффекта и видит числовое значение рядом с бегунком.",
    ],
    title: "Jelly Slider",
    category: "Ввод",
    description: "Потяните упругий бегунок",
    gesture: "Потяните упругий бегунок",
    usage: "<JellySlider label=\"Громкость\" />",
    references: [
      {
        id: "db-jelly-slider",
        name: "Jelly slider",
      },
    ],
    symbol: "JellySlider",
  },
  {
    slug: "detent-dial",
    useCases: [
      "На панели синтезатора музыкант выбирает одну из одиннадцати ступеней эффекта поворотом регулятора.",
      "В прототипе светильника дизайнер выбирает ступень яркости. Приложение переводит позицию от 0 до 10 в мощность подсветки.",
    ],
    title: "Detent Dial",
    category: "Ввод",
    description: "Поверните регулятор стрелками или свайпом",
    gesture: "Поверните регулятор стрелками или свайпом",
    usage: "<DetentDial label=\"Яркость\" />",
    references: [
      {
        id: "detent-dial",
        name: "Detent dial",
      },
    ],
    symbol: "DetentDial",
  },
  {
    slug: "exposure-slider",
    useCases: [
      "Фотограф корректирует экспозицию портрета и сравнивает результат с исходным снимком до сохранения.",
      "В уроке по фотографии ученик пробует отрицательную и положительную поправки на одном кадре, затем сбрасывает их к нулю.",
    ],
    title: "Exposure Slider",
    category: "Ввод",
    description:
      "Шкала в EV управляет яркостью фотографии. Исходную экспозицию можно восстановить.",
    gesture: "Настройте экспозицию и сравните с оригиналом",
    usage: "<ExposureSlider image=\"/photos/portrait.jpg\" />",
    references: [
      {
        id: "exposure-slider",
        name: "Exposure slider",
      },
    ],
    symbol: "ExposureSlider",
  },
  {
    slug: "wheel-picker",
    useCases: [
      "При настройке профиля пользователь прокручивает часовые пояса до своего и сохраняет выбранную строку.",
      "В мобильном таймере пользователь выбирает длительность из готовых интервалов. Приложение задаёт ей соответствующее время.",
    ],
    title: "Wheel Picker",
    category: "Ввод",
    description: "Прокрутите список до нужного значения",
    gesture: "Прокрутите список до нужного значения",
    usage: "<WheelPicker label=\"UTC\" items={[\"UTC−1\", \"UTC\", \"UTC+1\"]} />",
    references: [
      {
        id: "wheel-picker",
        name: "Wheel picker",
      },
    ],
    symbol: "WheelPicker",
  },
  {
    slug: "scrubber",
    useCases: [
      "В предпросмотре анимации дизайнер перемещается к отдельному кадру, чтобы проверить положение объекта.",
      "При разборе записи эксперимента исследователь выбирает номер измерения. Приложение отображает данные для этой позиции.",
    ],
    title: "Scrubber",
    category: "Ввод",
    description: "Прокрутите шкалу времени",
    gesture: "Прокрутите шкалу времени",
    usage: "<Scrubber frames={24} />",
    references: [
      {
        id: "scrubber",
        name: "Scrubber",
      },
    ],
    symbol: "Scrubber",
  },
  {
    slug: "receipt-printer",
    useCases: [
      "После оплаты заказа магазин показывает чек с номером, который вернул сервер. Покупатель может повторно открыть печать уже подтверждённого чека.",
      "В прототипе кассы дизайнер проводит демонстрационную покупку и показывает выдачу чека без подключения платёжного сервиса.",
    ],
    task: "Напечатать чек после подтверждения оплаты.",
    title: "Receipt Printer",
    category: "Карточки",
    description:
      "Подтверждение оплаты с анимацией термопринтера и повторной печатью чека.",
    gesture: "Оплатите демозаказ и посмотрите, как выходит чек",
    usage: "<ReceiptPrinter merchant=\"Studio\" order={{ id: \"S-12\", description: \"Print\", amount: 32, currency: \"EUR\" }} />",
    references: [],
    symbol: "ReceiptPrinter",
  },
  {
    slug: "card-field",
    useCases: [
      "В прототипе оформления заказа тестировщик подставляет встроенную тестовую карту и сбрасывает её для следующего прохода.",
      "В настоящем checkout клиент заполняет форму Stripe Elements по HTTPS. По onCompleteChange приложение узнаёт, когда можно предложить переход к подтверждению оплаты.",
    ],
    task: "Ввести тестовый номер карты или подключить платёжное поле Stripe.",
    title: "Card Field",
    category: "Ввод",
    description: "Попробуйте тестовую карту",
    gesture: "Попробуйте тестовую карту",
    usage: "<CardField mode=\"demo\" />",
    references: [
      {
        id: "card-field",
        name: "Card field",
      },
    ],
    symbol: "CardField",
  },
  {
    slug: "signature-pad",
    useCases: [
      "При выдаче оборудования получатель рисует подпись пальцем. Приложение прикладывает полученный PNG к записи выдачи.",
      "В конструкторе открыток автор добавляет рукописный автограф, отменяет неудачный штрих и сохраняет рисунок.",
    ],
    title: "Signature Pad",
    category: "Ввод",
    description: "Нарисуйте подпись и сохраните результат",
    gesture: "Нарисуйте подпись и попробуйте отменить штрих",
    usage: "<SignaturePad onSave={png => { const link = document.createElement(\"a\"); link.download = \"signature.png\"; link.href = png; link.click(); }} />",
    references: [
      {
        id: "signature-pad",
        name: "Signature pad",
      },
    ],
    symbol: "SignaturePad",
  },
  {
    slug: "parallax-ticket",
    useCases: [
      "На странице концерта посетитель рассматривает обложку билета и переворачивает его, чтобы увидеть дату.",
      "В портфолио айдентики дизайнер показывает макет пропуска с собственной обложкой, названием и датой мероприятия.",
    ],
    title: "Parallax Ticket",
    category: "Карточки",
    description: "Наклоните билет курсором",
    gesture: "Наклоните билет курсором",
    usage: "<ParallaxTicket title=\"Studio Night\" date=\"2027-04-17\" />",
    references: [
      {
        id: "db-parallax-ticket",
        name: "Parallax ticket",
      },
    ],
    symbol: "ParallaxTicket",
  },
  {
    slug: "glass-lens",
    useCases: [
      "В карточке ткани покупатель ведёт лупу по фотографии, чтобы рассмотреть переплетение нитей.",
      "При разборе макета дизайнер увеличивает мелкую деталь скриншота и перемещает лупу стрелками клавиатуры.",
    ],
    title: "Glass Lens",
    category: "Карточки",
    description: "Перемещайте линзу по рисунку",
    gesture: "Перемещайте линзу, нажмите для увеличения",
    usage: "<GlassLens label=\"Orbit\" image=\"/photos/orbit.jpg\" />",
    references: [
      {
        id: "db-glass-lens",
        name: "Glass lens",
      },
    ],
    symbol: "GlassLens",
  },
  {
    slug: "pull-refresh",
    useCases: [
      "В мобильной панели недавних файлов сотрудник тянет список вниз. Приложение запрашивает свежие данные в onRefresh.",
      "После обрыва связи пользователь повторяет синхронизацию кнопкой и по статусу видит, завершился ли запрос.",
    ],
    title: "Pull Refresh",
    category: "Карточки",
    description:
      "Синхронизация файла с предварительным натяжением и отменой короткого жеста.",
    gesture: "Потяните список вниз, затем отпустите",
    usage: "<PullRefresh onRefresh={async () => { const result = await fetch(\"/api/status\", { cache: \"no-store\" }); if (!result.ok) throw new Error(\"Refresh failed\"); }} />",
    references: [
      {
        id: "db-pull-refresh",
        name: "Pull to refresh",
      },
    ],
    symbol: "PullRefresh",
  },
  {
    slug: "expand-card",
    useCases: [
      "В подборке коллекций покупатель открывает одну карточку, читает подробности и возвращается к обзору.",
      "В афише мастерской организатор помещает полное описание занятия под компактной обложкой, которую посетитель раскрывает по нажатию.",
    ],
    title: "Expand Card",
    category: "Карточки",
    description: "Выберите коллекцию, чтобы развернуть обложку и детали",
    gesture: "Выберите коллекцию, чтобы развернуть обложку и детали",
    usage: "<ExpandCard title=\"Studio\" body=\"Расписание мастерской\" />",
    references: [
      {
        id: "db-expand-card",
        name: "Expand card",
      },
    ],
    symbol: "ExpandCard",
  },
  {
    slug: "fan-cards",
    useCases: [
      "В портфолио иллюстратора посетитель раскрывает веер подписанных работ, чтобы увидеть состав серии.",
      "В демо карточной игры игрок раскрывает руку и проводит указателем по картам, чтобы приподнять отдельную карту.",
    ],
    title: "Fan Cards",
    category: "Карточки",
    description:
      "Колода раскрывается веером и мягко приподнимает карту под указателем.",
    gesture: "Раскройте колоду и проведите по картам",
    usage: "<FanCards cards={[\"Orbit\", \"Fold\", \"Glass\"]} />",
    references: [
      {
        id: "db-fan-cards",
        name: "Fan cards",
      },
    ],
    symbol: "FanCards",
  },
  {
    slug: "profile-card",
    useCases: [
      "В каталоге наставников студент открывает диалог с выбранным специалистом. Приложение получает имя через onMessage.",
      "В сообществе читатель подписывается на автора со страницы его профиля. Приложение сохраняет состояние подписки.",
    ],
    title: "Profile Card",
    category: "Карточки",
    description: "Подпишитесь и посмотрите, как меняются счётчик и кнопки",
    gesture: "Подпишитесь и посмотрите, как меняются счётчик и кнопки",
    usage: "<ProfileCard name=\"Sam Lee\" role=\"Designer\" />",
    references: [
      {
        id: "db-profile-card",
        name: "Profile card",
      },
    ],
    symbol: "ProfileCard",
  },
  {
    slug: "boarding-pass",
    useCases: [
      "На экране поездки пассажир раскрывает посадочный талон и сверяет место, выход и время посадки.",
      "В маршруте с пересадкой приложение показывает отдельный талон для каждого рейса, чтобы путешественник различал сегменты пути.",
    ],
    title: "Boarding Pass",
    category: "Карточки",
    description:
      "Посадочный талон с маршрутом, номером выхода и раскрывающимся штрихкодом.",
    gesture: "Раскройте посадочный талон",
    usage: "<BoardingPass from=\"LIS\" to=\"AMS\" flight=\"TK 204\" seat=\"12A\" />",
    references: [
      {
        id: "boarding-pass",
        name: "Boarding pass",
      },
    ],
    symbol: "BoardingPass",
  },
  {
    slug: "notification-stack",
    useCases: [
      "На панели команды сотрудник просматривает стопку уведомлений о сборках и закрывает уже прочитанные сообщения.",
      "В центре событий приложение обновляет уведомления со стабильными идентификаторами, пока пользователь разбирает оставшиеся карточки.",
    ],
    title: "Notification Stack",
    category: "Карточки",
    description: "Раскройте стопку или смахните уведомление",
    gesture: "Раскройте стопку или смахните уведомление",
    usage: "<NotificationStack notifications={[{ id: \"build-24\", title: \"Сборка завершена\", time: \"10:00\" }]} />",
    references: [
      {
        id: "notification-stack",
        name: "Notification stack",
      },
    ],
    symbol: "NotificationStack",
  },
  {
    slug: "page-flip",
    useCases: [
      "В цифровом буклете посетитель перелистывает короткие подписи к главам как страницы печатного издания.",
      "В презентации визуальной концепции дизайнер показывает по одному тезису на разворот и листает в обе стороны стрелками.",
    ],
    title: "Page Flip",
    category: "Карточки",
    description: "Лист с двумя сторонами переворачивается вокруг корешка.",
    gesture: "Перелистните нажатием или стрелками",
    usage: "<PageFlip pages={[\"Введение\", \"API\", \"CLI\"]} />",
    references: [
      {
        id: "page-flip",
        name: "Page flip",
      },
    ],
    symbol: "PageFlip",
  },
  {
    slug: "stack-panel",
    useCases: [
      "В компактных настройках пользователь проходит от корневого меню к параметрам уведомлений и возвращается на уровень выше.",
      "В справке продукта читатель выбирает тему. Приложение показывает связанный текст внутри той же панели через renderPanel.",
    ],
    title: "Stack Panel",
    category: "Навигация",
    description: "Откройте проект и смахните вправо, чтобы вернуться",
    gesture: "Откройте проект и смахните вправо, чтобы вернуться",
    usage: "<StackPanel title=\"Настройки\" items={[\"API\", \"CLI\"]} renderPanel={name => <p>{name}</p>} />",
    references: [
      {
        id: "stack-panel",
        name: "Stack panel",
      },
    ],
    symbol: "StackPanel",
  },
  {
    slug: "weight-wave",
    useCases: [
      "На странице шрифтовой студии посетитель проводит по слову и наблюдает, как меняется насыщенность соседних букв.",
      "В интерактивном образце логотипа дизайнер передвигает акцент по буквам с клавиатуры, чтобы изучить форму каждой.",
    ],
    title: "Weight Wave",
    category: "Текст",
    description: "Проведите по буквам или нажмите",
    gesture: "Проведите по буквам или нажмите",
    usage: "<WeightWave text=\"Takt Studio\" />",
    references: [
      {
        id: "db-weight-wave",
        name: "Weight wave",
      },
    ],
    symbol: "WeightWave",
  },
  {
    slug: "goo-morph",
    useCases: [
      "В презентации бренда зритель нажимает на ключевое слово, чтобы увидеть следующий принцип в серии.",
      "В витрине анимаций дизайнер сравнивает переход между короткими и длинными названиями, подставив свои слова.",
    ],
    title: "Goo Morph",
    category: "Текст",
    description: "Переключите текучую надпись",
    gesture: "Переключите текучую надпись",
    usage: "<GooMorph words={[\"Design\", \"Build\", \"Ship\"]} />",
    references: [
      {
        id: "db-goo-morph",
        name: "Goo morph",
      },
    ],
    symbol: "GooMorph",
  },
  {
    slug: "scramble-text",
    useCases: [
      "На промостранице игры посетитель запускает эффект расшифровки, который раскрывает название миссии.",
      "В презентации релиза ведущий раскрывает кодовое имя версии как анимированную надпись.",
    ],
    title: "Scramble Text",
    category: "Текст",
    description: "Расшифруйте строку",
    gesture: "Расшифруйте строку",
    usage: "<ScrambleText text=\"STUDIO\" />",
    references: [
      {
        id: "db-scramble-text",
        name: "Scramble text",
      },
    ],
    symbol: "ScrambleText",
  },
  {
    slug: "read-along",
    useCases: [
      "На языковом занятии ученик запускает последовательную подсветку слов и останавливается на трудном месте.",
      "При репетиции короткой речи выступающий выбирает слово в середине текста и продолжает с него в заданном темпе.",
    ],
    title: "Read Along",
    category: "Текст",
    description:
      "Слова подсвечиваются в ритме чтения с паузой и пошаговым переходом.",
    gesture: "Продвигайтесь по словам",
    usage: "<ReadAlong text=\"Следуйте за подсветкой текста\" interval={300} />",
    references: [
      {
        id: "db-read-along",
        name: "Read along",
      },
    ],
    symbol: "ReadAlong",
  },
  {
    slug: "roll-links",
    useCases: [
      "В навигации портфолио посетитель видит отклик при наведении на название раздела и переходит по обычной ссылке.",
      "Внизу статьи читатель переводит клавиатурный фокус на ссылку документации и открывает её без мыши.",
    ],
    title: "Roll Links",
    category: "Текст",
    description: "Наведите курсор или сфокусируйте ссылку",
    gesture: "Наведите курсор или сфокусируйте ссылку",
    usage: "<RollLinks label=\"Документация\" href=\"/docs\" />",
    references: [
      {
        id: "db-roll-links",
        name: "Roll links",
      },
    ],
    symbol: "RollLinks",
  },
  {
    slug: "marker-text",
    useCases: [
      "В конспекте лекции преподаватель нажимает на короткую цитату, чтобы выделить её во время объяснения.",
      "При презентации редактор отмечает ключевой тезис маркером и снимает выделение перед следующим показом.",
    ],
    title: "Marker Text",
    category: "Текст",
    description: "Выделите фразу маркером",
    gesture: "Выделите фразу маркером",
    usage: "<MarkerText text=\"Новая версия\" />",
    references: [
      {
        id: "marker-text",
        name: "Marker text",
      },
    ],
    symbol: "MarkerText",
  },
  {
    slug: "dynamic-text",
    useCases: [
      "В заголовке продуктовой линейки постоянным остаётся название бренда, а посетитель перебирает названия продуктов нажатием.",
      "В учебном примере студент меняет окончание короткой фразы и видит разные сочетания с одной и той же первой частью.",
    ],
    title: "Dynamic Text",
    category: "Текст",
    description: "Смените слово в заголовке",
    gesture: "Смените слово в заголовке",
    usage: "<DynamicText prefix=\"Takt\" words={[\"Studio\", \"Motion\"]} />",
    references: [
      {
        id: "dynamic-text",
        name: "Dynamic text",
      },
    ],
    symbol: "DynamicText",
  },
  {
    slug: "typewriter",
    useCases: [
      "В демонстрации терминала читатель запускает посимвольный показ заранее подготовленной команды.",
      "На вводном экране игры автор задаёт медленный темп появления реплики, чтобы игрок прочитал её как диалог.",
    ],
    title: "Typewriter",
    category: "Текст",
    description: "Запустите набор текста",
    gesture: "Запустите набор текста",
    usage: "<Typewriter text=\"Hello, Takt.\" interval={70} />",
    references: [
      {
        id: "type-writer",
        name: "Typewriter",
      },
    ],
    symbol: "Typewriter",
  },
  {
    slug: "music-toggle",
    useCases: [
      "На выставочном сайте посетитель включает фоновую музыку. Приложение запускает дорожку по событию переключателя.",
      "В интерактивной истории читатель выключает сопровождение, сохраняя возможность продолжить чтение без звука.",
    ],
    title: "Music Toggle",
    category: "Кнопки",
    description: "Переключите анимацию эквалайзера",
    gesture: "Переключите анимацию эквалайзера",
    usage: "<MusicToggle onChange={enabled => localStorage.setItem(\"music\", String(enabled))} />",
    references: [
      {
        id: "music-toggle",
        name: "Music toggle",
      },
    ],
    symbol: "MusicToggle",
  },
  {
    slug: "prompt-box",
    useCases: [
      "На пустом экране ассистента аналитик выбирает подсказку «Суммируй отчёт», уточняет запрос и отправляет его.",
      "В помощнике редактора автор формулирует собственную задачу. Приложение возвращает Promise запроса, чтобы форма показала состояние отправки и разрешила повтор при ошибке.",
    ],
    title: "Prompt Box",
    category: "AI",
    description: "Введите запрос и отправьте",
    gesture: "Введите запрос и отправьте",
    usage: "<PromptBox suggestions={[\"Объясни этот пример\"]} onSend={text => localStorage.setItem(\"last-prompt\", text)} />",
    references: [
      {
        id: "db-prompt-box",
        name: "Prompt box",
      },
    ],
    symbol: "PromptBox",
  },
  {
    slug: "streaming-reply",
    useCases: [
      "В демо чат-бота посетитель запускает постепенный показ заранее написанного ответа и наблюдает, как появляются слова.",
      "В учебном разборе студент читает сформированное объяснение по частям. Приложение передаёт готовый текст для воспроизведения.",
    ],
    title: "Streaming Reply",
    category: "AI",
    description: "Покажите ответ по частям",
    gesture: "Покажите ответ по частям",
    usage: "<StreamingReply text=\"Черновик ответа готов.\" />",
    references: [
      {
        id: "db-streaming-reply",
        name: "Streaming reply",
      },
    ],
    symbol: "StreamingReply",
  },
  {
    slug: "ghost-suggestion",
    useCases: [
      "В форме поездки пользователь начинает вводить город и дополняет название предложенным совпадением из списка.",
      "В поле команды разработчик вводит префикс известной команды. Приложение передаёт словарь, из которого поле предлагает продолжение.",
    ],
    title: "Ghost Suggestion",
    category: "AI",
    description: "Начните ввод и примите подсказку стрелкой вправо",
    gesture: "Начните ввод и примите подсказку стрелкой вправо",
    usage: "<GhostSuggestion options={[\"Amsterdam\", \"Athens\", \"Lisbon\"]} />",
    references: [
      {
        id: "db-ghost-suggestion",
        name: "Ghost suggestion",
      },
    ],
    symbol: "GhostSuggestion",
  },
  {
    slug: "goo-thinking",
    useCases: [
      "В прототипе помощника дизайнер нажатием переводит индикатор обработки в короткий демонстрационный ответ.",
      "В презентации поиска ведущий повторяет переход от надписи «Ищем совпадения» к заранее заданному результату.",
    ],
    title: "Goo Thinking",
    category: "AI",
    description: "Нажмите на капли, чтобы раскрыть ответ",
    gesture: "Нажмите на капли, чтобы раскрыть ответ",
    usage: "<GooThinking label=\"Анализ\" reply=\"Готово\" />",
    references: [
      {
        id: "db-goo-thinking",
        name: "Goo thinking",
      },
    ],
    symbol: "GooThinking",
  },
  {
    slug: "siri-orb",
    useCases: [
      "В голосовом помощнике пользователь видит, когда приложение слушает, обрабатывает запрос или отвечает. Приложение передаёт текущее состояние в AssistantOrb.",
      "На экране записи приложение передаёт нормализованную амплитуду микрофона, чтобы сфера реагировала на громкость голоса.",
    ],
    title: "Assistant Orb",
    category: "AI",
    description: "Переключайте состояния ассистента",
    gesture: "Переключайте состояния ассистента",
    usage: '<AssistantOrb state="thinking" />',
    references: [
      {
        id: "siri-orb",
        name: "Siri orb",
      },
    ],
    symbol: "AssistantOrb",
  },
  {
    slug: "agent-steps",
    useCases: [
      "В обучающем демо пользователь по шагам проводит агента от чтения файла до подготовки результата и видит число завершённых этапов.",
      "Во время презентации ведущий переключает этап кнопкой. Приложение использует onStep, чтобы рядом показать артефакт соответствующего шага.",
    ],
    title: "Agent Steps",
    category: "AI",
    description: "Проведите агента по этапам",
    gesture: "Проведите агента по этапам",
    usage: "<AgentSteps steps={[\"Прочитать\", \"Проверить\", \"Сохранить\"]} />",
    references: [
      {
        id: "ai-loading",
        name: "Agent steps",
      },
    ],
    symbol: "AgentSteps",
  },
  {
    slug: "tool-approval",
    useCases: [
      "Перед созданием события ассистент показывает календарь и действие. Пользователь разрешает или отклоняет запрос, а приложение обрабатывает решение.",
      "В рабочем пространстве агент предлагает изменить конкретный файл. Редактор проверяет имя ресурса перед подтверждением записи.",
    ],
    title: "Tool Approval",
    category: "AI",
    description: "Разрешите или отклоните действие",
    gesture: "Разрешите или отклоните действие",
    usage: "<ToolApproval action=\"Запустить сборку\" resource=\"package.json\" onDecision={allowed => console.info({ allowed })} />",
    references: [
      {
        id: "ai-tool-approval",
        name: "Tool approval",
      },
    ],
    symbol: "ToolApproval",
  },
  {
    slug: "thinking-text",
    useCases: [
      "Пока помощник собирает контекст документа, читатель видит короткую подпись о текущем этапе рядом с областью ответа.",
      "На странице отчёта приложение показывает «Обрабатываем строки» до завершения фонового расчёта, затем заменяет индикатор результатом.",
    ],
    title: "Thinking Text",
    category: "AI",
    description: "Включите текстовый индикатор",
    gesture: "Включите текстовый индикатор",
    usage: "<ThinkingText label=\"Загружаем контекст\" />",
    references: [
      {
        id: "ai-text-loading",
        name: "Thinking text",
      },
    ],
    symbol: "ThinkingText",
  },
  {
    slug: "task-list",
    useCases: [
      "Перед релизом участник команды отмечает выполненные проверки и видит, сколько пунктов осталось.",
      "В учебном практикуме студент отмечает выполненные задания. Приложение сохраняет список завершённых названий через onChange.",
    ],
    title: "Task List",
    category: "AI",
    description: "Пройдите очередь задач",
    gesture: "Пройдите очередь задач",
    usage: "<TaskList tasks={[\"Lint\", \"Build\", \"Deploy\"]} />",
    references: [
      {
        id: "ai-task-list",
        name: "Task list",
      },
    ],
    symbol: "TaskList",
  },
  {
    slug: "voice-input",
    useCases: [
      "В обсуждении пользователь записывает голосовой комментарий и останавливает запись. Приложение прикрепляет полученный аудиофайл к сообщению.",
      "В форме заметки автор диктует идею. Приложение отправляет Blob из onRecord в свой сервис расшифровки.",
    ],
    title: "Voice Input",
    category: "AI",
    description: "Запишите и прослушайте голосовую заметку",
    gesture: "Запишите и прослушайте голосовую заметку",
    usage: "<VoiceInput onRecord={blob => console.info(blob.type, blob.size)} />",
    references: [
      {
        id: "ai-voice",
        name: "Voice input",
      },
    ],
    symbol: "VoiceInput",
  },
  {
    slug: "hold-to-publish",
    useCases: [
      "Перед выпуском статьи редактор удерживает кнопку публикации. Приложение отправляет материал в CMS после завершения удержания.",
      "В кабинете преподавателя автор начинает публикацию урока, замечает ошибку и отпускает кнопку до подтверждения.",
    ],
    title: "Hold to Publish",
    category: "Кнопки",
    description:
      "Удержание заполняет кнопку публикации. После отправки она складывается в галочку.",
    gesture: "Удерживайте до публикации",
    usage: "<HoldToPublish onPublish={() => console.log('published')} />",
    references: [
      {
        id: "db-hold-button",
        name: "Hold to publish",
      },
    ],
    symbol: "HoldToPublish",
  },
  {
    slug: "command-search",
    useCases: [
      "В базе документации разработчик нажимает Ctrl/⌘+K, вводит фразу и открывает страницу результатов через обработчик приложения.",
      "В тесной панели проекта пользователь раскрывает поле из кнопки и ищет файл по произвольному тексту.",
    ],
    task: "Ввести произвольный поисковый запрос и передать его в поиск приложения.",
    title: "Command Search",
    category: "Кнопки",
    description:
      "Кнопка раскрывается в поле поиска по клику или по ⌘/Ctrl + K.",
    gesture: "Нажмите и введите запрос",
    usage: "<CommandSearch onSearch={query => location.assign(\"/search?q=\" + encodeURIComponent(query))} />",
    references: [
      {
        id: "db-command-button",
        name: "Command button",
      },
    ],
    symbol: "CommandSearch",
  },
  {
    slug: "swipe-tabs",
    useCases: [
      "В мобильной карточке товара покупатель смахивает между описанием, характеристиками и отзывами.",
      "В кабинете курса студент открывает ссылку на вкладку практики. Приложение задаёт выбранный id и обновляет адрес при дальнейших переключениях.",
    ],
    title: "Swipe Tabs",
    category: "Навигация",
    description:
      "Горизонтальный жест сдвигает панель раздела и активную подложку вкладки.",
    gesture: "Смахните панель в сторону",
    usage: "<SwipeTabs onChange={console.log} />",
    references: [
      {
        id: "smooth-tab",
        name: "Smooth tab",
      },
    ],
    symbol: "SwipeTabs",
  },
  {
    slug: "lesson-outline", title: "Lesson Outline", category: "Обучение",
    useCases: [
      "Вернувшись к курсу, студент видит текущий урок в оглавлении и продолжает с него через кнопку возобновления.",
      "Перед занятием участник просматривает последовательность тем и переходит по ссылке к нужному уроку.",
    ],
    description: "Программа курса с выбором урока и возвратом к обучению.",
    gesture: "Выберите урок и откройте его", usage: "<LessonOutline title=\"React\" currentId=\"state\" items={[{ id: \"state\", title: \"State\", href: \"/lessons/state\" }]} />", references: [], symbol: "LessonOutline",
  },
  {
    slug: "code-exercise", title: "Code Exercise", category: "Обучение",
    useCases: [
      "На уроке регулярных выражений студент исправляет шаблон, проверяет его на наборе строк и изучает несовпадения.",
      "В практикуме студент возвращается к незавершённому упражнению. Приложение задаёт отдельный draftKey на задание, чтобы восстановить его черновик.",
    ],
    description: "Редактор задания с запуском, проверкой тестов и разбором ошибки.",
    gesture: "Исправьте шаблон и проверьте решение", usage: "<CodeExercise draftKey=\"lesson:ids:v1\" initialSource=\"^UI-[0-9]+$\" tests={[{ input: \"UI-23\", expected: true }]} />", references: [], symbol: "CodeExercise",
  },
  {
    slug: "run-console", title: "Run Console", category: "Обучение",
    useCases: [
      "Во время запуска упражнения студент видит этап выполнения, вывод и длительность, полученные от исполнителя.",
      "Если запуск завис или завершился ошибкой, студент просит остановить его либо переходит к проблемной строке через обработчик редактора.",
    ],
    description: "Состояния компиляции и выполнения с выводом, временем и остановкой.",
    gesture: "Запустите или остановите пример", usage: "<RunConsole state={{ phase: \"done\", output: \"OK\", duration: 120 }} />", references: [], symbol: "RunConsole",
  },
  {
    slug: "test-results", title: "Test Results", category: "Обучение",
    useCases: [
      "После проверки решения студент выбирает упавший тест и сравнивает вход, ожидаемое и фактическое значения.",
      "Во время разбора студент просит объяснить конкретное расхождение. Приложение передаёт выбранный тест наставнику через onAsk.",
    ],
    description: "Сравнение ожидаемого и полученного результата на конкретном входе.",
    gesture: "Выберите тест и сравните значения", usage: "<TestResults results={[{ input: \"UI-23\", expected: true, actual: false }]} />", references: [], symbol: "TestResults",
  },
  {
    slug: "ask-tutor", title: "Ask Tutor", category: "Обучение",
    useCases: [
      "Во время упражнения студент задаёт вопрос по выделенному коду. Приложение передаёт вопрос и контекст в сервис наставника.",
      "Разбирая ошибку, студент убирает нерелевантный источник перед отправкой и читает ответ со ссылкой на нужное место урока.",
    ],
    description: "Вопрос по материалу урока или ошибке с выбранными источниками.",
    gesture: "Задайте вопрос по уроку", usage: "<AskTutor context={[\"lesson.md § 2\", \"pattern.regex\"]} />", references: [], symbol: "AskTutor",
  },
  {
    slug: "lesson-citation", title: "Lesson Citation", category: "Обучение",
    useCases: [
      "Под ответом наставника студент раскрывает цитату и сверяет объяснение с исходным абзацем урока.",
      "В разборе задания читатель открывает ссылку на раздел учебника. Приложение может вернуть его к отмеченному месту через onReturn.",
    ],
    description: "Ссылка на конкретный фрагмент урока с возвратом к задаче.",
    gesture: "Откройте фрагмент урока", usage: "<LessonCitation title=\"React\" locator=\"§ 2\" excerpt=\"State\" href=\"/lessons/state\" />", references: [], symbol: "LessonCitation",
  },
  {
    slug: "predict-output", title: "Predict Output", category: "Обучение",
    useCases: [
      "Перед запуском примера студент выбирает предполагаемый вывод программы и читает объяснение результата.",
      "В контрольной точке урока преподаватель задаёт варианты ответа для выражения. Приложение записывает выбор ученика через onAnswer.",
    ],
    description: "Прогноз вывода программы с проверкой ответа и объяснением.",
    gesture: "Выберите прогноз и сверьте его", usage: "<PredictOutput code=\"2 ** 3\" options={[\"6\", \"8\"]} answer=\"8\" explanation=\"2 × 2 × 2\" />", references: [], symbol: "PredictOutput",
  },
  {
    slug: "execution-trace", title: "Execution Trace", category: "Обучение",
    useCases: [
      "Разбирая цикл, студент переходит от шага к шагу и следит за значением счётчика рядом с подсвеченной строкой.",
      "При объяснении ошибки преподаватель возвращается к шагу, на котором переменная впервые получила неверное значение.",
    ],
    description: "Пошаговое выполнение с подсветкой строки и значений переменных.",
    gesture: "Пройдите код по шагам", usage: "<ExecutionTrace code={[\"let x = 2\", \"x *= 3\"]} steps={[{ line: 1, variables: { x: 2 } }, { line: 2, variables: { x: 6 } }]} />", references: [], symbol: "ExecutionTrace",
  },
  {
    slug: "hint-ladder", title: "Hint Ladder", category: "Обучение",
    useCases: [
      "Застряв в задаче, студент открывает сначала общую подсказку и запрашивает следующую только при необходимости.",
      "В практикуме преподаватель выстраивает подсказки от идеи до конкретного шага. Приложение отмечает, до какой подсказки дошёл ученик.",
    ],
    description: "Подсказки раскрываются по одной от вопроса до похожего примера.",
    gesture: "Открывайте подсказки по очереди", usage: "<HintLadder items={[\"Сравните входные данные\", \"Проверьте длину\"]} />", references: [], symbol: "HintLadder",
  },
  {
    slug: "channel-list", title: "Channel List", category: "Мессенджер",
    useCases: [
      "В боковой панели курса студент выбирает канал потока. Приложение открывает переписку по стабильному id канала.",
      "В командном чате сотрудник переключается с общего канала на личный диалог. Список подсвечивает выбор, которым управляет приложение.",
    ],
    description: "Список каналов курса и личных диалогов.",
    gesture: "Выберите другой диалог", usage: "<ChannelList workspace=\"Studio\" channels={[{ id: \"design\", name: \"design\", kind: \"channel\", topic: \"Review\" }]} />", references: [], symbol: "ChannelList",
  },
  {
    slug: "chat-composer",
    useCases: [
      "На странице заявки клиент отправляет комментарий. Если сеть недоступна, набранный текст остаётся в поле для повторной отправки.",
      "При переключении между диалогами оператор возвращается к недописанному ответу. Приложение хранит отдельный черновик на диалог и передаёт его в value.",
    ],
    task: "Отправить сообщение из существующей страницы и сохранить черновик при ошибке.", title: "Chat Composer", category: "Мессенджер",
    description: "Редактор с черновиком, переносом строки и состояниями отправки.",
    gesture: "Напишите и отправьте сообщение", usage: "<ChatComposer placeholder=\"Написать в команду\" />", references: [], symbol: "ChatComposer",
  },
  {
    slug: "message-reactions", title: "Message Reactions", category: "Мессенджер",
    useCases: [
      "Под сообщением о релизе коллега ставит реакцию и видит обновлённый счётчик рядом с эмодзи.",
      "В обсуждении предложения участник снимает свою реакцию. Приложение обновляет счётчик этого эмодзи, сохраняя отметки остальных участников.",
    ],
    description: "Реакции на сообщение со счётчиками участников.",
    gesture: "Добавьте или снимите реакцию", usage: "<MessageReactions onToggle={emoji => console.info(emoji)} />", references: [], symbol: "MessageReactions",
  },
  {
    slug: "chat-post",
    useCases: [
      "В журнале поддержки читатель видит одно сообщение с автором, временем и фрагментом кода, даже если на странице нет редактора ответа.",
      "В ленте курса преподаватель прикладывает ссылку на методичку. Карточка показывает ресурс под текстом, а приложение добавляет реакции через children.",
    ],
    task: "Показать одно сообщение в собственной ленте или обсуждении.", title: "Chat Post", category: "Мессенджер",
    description: "Одно сообщение с автором, текстом, кодом и ссылкой на материал.",
    gesture: "Прочитайте сообщение и откройте материал",
    usage: '<ChatPostBody post={{ id: "release", author: "Sam", initials: "S", time: "10:00", text: "v2.0" }} />',
    references: [], symbol: "ChatPostBody",
  },
  {
    slug: "message-thread",
    useCases: [
      "В разборе макета дизайнер открывает ветку комментария и отвечает, видя исходное сообщение над перепиской.",
      "В службе поддержки оператор переключается между ветками. Приложение сохраняет черновик отдельно от уже отправленных ответов каждой ветки.",
    ],
    task: "Показать исходное сообщение и ответы с отдельным полем ввода.", title: "Message Thread", category: "Мессенджер",
    description: "Ответы с контекстом исходного сообщения и отдельным редактором.",
    gesture: "Продолжите обсуждение", usage: "<MessageThread parent={{ id: \"24\", author: \"Sam\", initials: \"S\", time: \"10:00\", text: \"PR #24\" }} />", references: [], symbol: "MessageThread",
  },
  {
    slug: "course-messenger",
    useCases: [
      "В учебном кабинете студент обсуждает задание в канале группы и открывает ветку конкретного вопроса.",
      "В командном пространстве сотрудник попеременно ведёт личный и общий диалоги. Приложение синхронизирует сообщения и реакции с сервером.",
    ],
    task: "Собрать рабочее пространство с каналами, личными сообщениями, реакциями и обсуждениями.", title: "Course Messenger", category: "Мессенджер",
    description: "Рабочее пространство с каналами, личными сообщениями и тредами.",
    gesture: "Откройте канал и ответьте в треде", usage: "<CourseMessenger workspace=\"Studio\" channels={[{ id: \"design\", name: \"design\", kind: \"channel\", topic: \"Review\" }]} initialMessages={{ design: [] }} />", references: [], symbol: "CourseMessenger",
  },
  {
    slug: "latency-chart",
    useCases: [
      "После релиза инженер сравнивает медиану задержки API с p95, чтобы увидеть замедление у части запросов.",
      "При разборе инцидента дежурный перемещается между замерами и отличает отсутствующее измерение от измеренного нуля.",
    ],
    task: "Сравнить задержку p50 и p95 по времени.", title: "Latency Chart", category: "Метрики",
    description: "Измерения времени ответа с выбором перцентиля и точки во времени.", gesture: "Выберите перцентиль и сравните замеры",
    usage: "<LatencyChart title=\"API latency\" unit=\"ms\" samples={[{ label: \"10:00\", p50: 18, p95: 42 }, { label: \"10:05\", p50: 20, p95: null }]} />", references: [], symbol: "LatencyChart",
  },
  {
    slug: "conversion-funnel",
    useCases: [
      "В отчёте магазина аналитик сравнивает число посетителей на этапах корзины, оформления и покупки, чтобы найти крупнейшую потерю.",
      "Команда курса сопоставляет регистрации, первые занятия и завершения. Число участников каждого этапа рассчитывает приложение.",
    ],
    task: "Сравнить конверсию между последовательными этапами.", title: "Conversion Funnel", category: "Метрики",
    description: "Число участников на этапах и конверсия между соседними этапами.", gesture: "Выберите этап воронки",
    usage: "<ConversionFunnel stages={[{ id: \"visit\", label: \"Визит\", count: 120 }, { id: \"signup\", label: \"Регистрация\", count: 36 }]} />", references: [], symbol: "ConversionFunnel",
  },
  {
    slug: "cohort-retention",
    useCases: [
      "В отчёте подписок аналитик сравнивает, какая доля пользователей разных наборов вернулась через неделю после регистрации.",
      "В кабинете курса методист изучает возвращаемость потоков и отличает будущую неделю от прошедшей недели с нулём вернувшихся.",
    ],
    task: "Показать возвращаемость участников по когортам и периодам.", title: "Cohort Retention", category: "Метрики",
    description: "Возврат участников по когортам с отдельным состоянием для пропущенных наблюдений.", gesture: "Выберите когорту и неделю",
    usage: "<CohortRetention cohorts={[{ id: \"w1\", label: \"W01\", size: 80, retained: [80, 45, null] }]} />", references: [], symbol: "CohortRetention",
  },
  {
    slug: "issue-board", title: "Issue Board", category: "Трекеры",
    useCases: [
      "На стендапе разработчик переносит карточку из очереди в работу, чтобы команда увидела новый статус задачи.",
      "Во время разбора входящих менеджер создаёт задачу прямо на доске. Приложение сохраняет изменившийся список и обновляет другие представления.",
    ],
    description: "Канбан с переносом задач между статусами и быстрым созданием карточек.", gesture: "Создайте задачу и измените её статус",
    usage: "<IssueBoard defaultIssues={[{ id: \"UI-7\", title: \"Search\", status: \"active\", priority: \"high\", points: 3 }]} />", references: [], symbol: "IssueBoard",
  },
  {
    slug: "issue-table", title: "Issue Table", category: "Трекеры",
    useCases: [
      "При разборе бэклога менеджер сортирует задачи по приоритету и исправляет название прямо в строке.",
      "На встрече команды координатор меняет статус задачи в таблице. Доска получает тот же обновлённый массив и показывает новый статус.",
    ],
    description: "Таблица задач с редактированием названий, статусов и приоритетов.", gesture: "Измените свойство прямо в строке",
    usage: "<IssueTable defaultIssues={[{ id: \"UI-7\", title: \"Search\", status: \"active\", priority: \"high\", points: 3 }]} />", references: [], symbol: "IssueTable",
  },
  {
    slug: "cycle-planner", title: "Cycle Planner", category: "Трекеры",
    useCases: [
      "Перед спринтом команда добавляет оценённые задачи в цикл и видит, сколько баллов ещё помещается в план.",
      "При изменении доступной ёмкости руководитель снимает задачу с цикла и проверяет, устранена ли перегрузка.",
    ],
    description: "Планирование цикла по оценкам задач с резервом и превышением ёмкости.", gesture: "Измените состав цикла и проверьте загрузку",
    usage: "<CyclePlanner cycleId=\"Q2\" capacity={12} defaultIssues={[{ id: \"UI-7\", title: \"Search\", status: \"active\", priority: \"high\", points: 3, cycleId: \"Q2\" }]} />", references: [], symbol: "CyclePlanner",
  },
] as const;
export type Entry = (typeof entries)[number];

export function taskFor(entry: { description: string; task?: string }) {
  return entry.task ?? entry.description;
}

// Reading order for All. The individual category filters keep the catalog order above.
const allOrder: Entry["slug"][] = [
  // A first look across the collection
  "morph-island", "receipt-printer", "siri-orb", "fan-cards", "stat-card", "stack-panel",

  // Browse content, inspect details and play media
  "swipe-deck", "expand-card", "profile-card", "page-flip", "parallax-ticket",
  "boarding-pass", "glass-lens", "glass-player", "music-toggle", "scrubber",

  // Ask an assistant, follow its work and approve actions
  "voice-input", "prompt-box", "ghost-suggestion", "goo-thinking", "thinking-text",
  "streaming-reply", "agent-steps", "tool-approval", "task-list",

  // Learn, run code and get help
  "lesson-outline", "code-exercise", "run-console", "test-results", "ask-tutor",
  "lesson-citation", "predict-output", "execution-trace", "hint-ladder",

  "channel-list", "chat-composer", "chat-post", "message-reactions", "message-thread", "course-messenger",

  "latency-chart", "conversion-funnel", "cohort-retention",

  "issue-board", "issue-table", "cycle-planner",

  // Find a command and move between views
  "command-search", "command-palette", "command-button", "sidebar-collapse",
  "toolbar", "spring-dock", "rubber-dock", "dynamic-menu", "bloom-menu",
  "morph-popover", "morph-tooltip", "tab-pill", "swipe-tabs", "segmented-control",
  "pagination-dots", "step-progress",

  // Choose a plan, check out and confirm
  "plan-switch", "cart-button", "card-field", "unlock-face-id", "otp-code",
  "signature-pad", "slide-to-confirm", "hold-button", "hold-to-publish", "loading-success",

  // Enter values and adjust controls
  "springy-input", "invite-people", "password-strength", "letter-limit", "tag-input",
  "file-drop", "checkbox-list", "spring-switch", "spring-dropdown", "wheel-picker",
  "flip-counter", "wave-slider", "jelly-slider", "exposure-slider", "detent-dial",

  // Respond to actions and manage notifications
  "magnetic-button", "like-burst", "star-rating", "copy-button", "undo-button",
  "pull-refresh", "bell-button", "notification-stack", "focus-mode",

  // Read and animate text
  "read-along", "marker-text", "typewriter", "dynamic-text", "rolling-text",
  "roll-links", "scramble-text", "weight-wave", "goo-morph",
];

const allRank = new Map(allOrder.map((slug, index) => [slug, index]));
export const allEntries = [...entries].sort((a, b) =>
  (allRank.get(a.slug) ?? allOrder.length) - (allRank.get(b.slug) ?? allOrder.length)
);
