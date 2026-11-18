export const entries = [
  {
    slug: "invite-people",
    title: "Invite People",
    category: "Ввод",
    description:
      "Приглашение по email с проверкой адреса и обновлением списка участников.",
    gesture: "Введите адрес и пригласите участника",
    usage: "<InvitePeople />",
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
    title: "Focus Mode",
    category: "Карточки",
    description: "Уведомления сворачиваются, пока идёт сессия фокуса.",
    gesture: "Включите режим фокуса",
    usage: "<FocusMode />",
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
    title: "Swipe Deck",
    category: "Карточки",
    description:
      "Стопка арт-принтов следует за жестом и раскрывает следующий постер.",
    gesture: "Смахните или нажмите",
    usage: "<SwipeDeck />",
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
    title: "Glass Player",
    category: "Карточки",
    description:
      "Аудиоплеер с обложкой, перемоткой, повтором и отключением звука.",
    gesture: "Включите трек и перемотайте его",
    usage: "<GlassPlayer />",
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
    title: "Stat Card",
    category: "Карточки",
    description:
      "График показывает значение в выбранной точке и меняет период.",
    gesture: "Переключите вид графика и выберите точку",
    usage: "<StatCard />",
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
    title: "Plan Switch",
    category: "Карточки",
    description:
      "Переключение периода пересчитывает месячную стоимость, итог и скидку.",
    gesture: "Смените период оплаты",
    usage: "<PlanSwitch />",
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
    title: "File Drop",
    category: "Ввод",
    description:
      "Папка принимает файлы и показывает список с размером каждого.",
    gesture: "Перетащите файл или выберите с диска",
    usage: "<FileDrop />",
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
    title: "Morph Tooltip",
    category: "Навигация",
    description: "Наведите курсор или переведите фокус",
    gesture: "Наведите курсор или переведите фокус",
    usage: "<MorphTooltip />",
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
    title: "Command Button",
    category: "Кнопки",
    description: "Выполните команду",
    gesture: "Нажмите кнопку или ⌘ / Ctrl + Enter",
    usage: "<CommandButton />",
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
    title: "Loading Success",
    category: "Кнопки",
    description: "Запустите действие и дождитесь результата",
    gesture: "Запустите действие и дождитесь результата",
    usage: "<LoadingSuccess />",
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
    title: "Copy Button",
    category: "Кнопки",
    description: "Скопируйте текст",
    gesture: "Скопируйте текст",
    usage: "<CopyButton />",
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
    title: "Like Burst",
    category: "Кнопки",
    description: "Поставьте или снимите отметку",
    gesture: "Поставьте или снимите отметку",
    usage: "<LikeBurst />",
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
    title: "Slide To Confirm",
    category: "Кнопки",
    description:
      "Подтверждение выполняется в конце хода. Незавершённый жест возвращает бегунок.",
    gesture: "Сдвиньте ползунок до конца",
    usage: "<SlideToConfirm />",
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
    title: "Cart Button",
    category: "Карточки",
    description:
      "Раскрывающаяся корзина с количеством товаров и пересчётом суммы.",
    gesture: "Добавьте товар в корзину",
    usage: "<CartButton />",
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
    title: "Undo Button",
    category: "Кнопки",
    description: "Удалите запись и верните её",
    gesture: "Удалите запись и верните её",
    usage: "<UndoButton />",
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
    title: "Bell Button",
    category: "Кнопки",
    description: "Переключите оповещения",
    gesture: "Переключите оповещения",
    usage: "<BellButton />",
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
    title: "Unlock Face ID",
    category: "Карточки",
    description: "Запустите демонстрацию сканирования",
    gesture: "Запустите демонстрацию сканирования",
    usage: "<UnlockFaceId />",
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
    title: "Spring Dropdown",
    category: "Ввод",
    description: "Раскройте список и выберите статус",
    gesture: "Раскройте список и выберите статус",
    usage: "<SpringDropdown />",
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
    title: "Morph Island",
    category: "Карточки",
    description: "Панель для таймера, экспорта и входящего звонка.",
    gesture: "Выберите таймер, экспорт или звонок",
    usage: "<MorphIsland />",
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
    title: "Tab Pill",
    category: "Навигация",
    description: "Переключите вкладку",
    gesture: "Переключите вкладку",
    usage: "<TabPill />",
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
    title: "Segmented Control",
    category: "Навигация",
    description: "Выберите период",
    gesture: "Выберите период",
    usage: "<SegmentedControl />",
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
    title: "Rubber Dock",
    category: "Навигация",
    description: "Проведите по иконкам",
    gesture: "Проведите по иконкам",
    usage: "<RubberDock />",
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
    title: "Dynamic Menu",
    category: "Навигация",
    description: "Откройте меню и вложенный раздел",
    gesture: "Откройте меню и вложенный раздел",
    usage: "<DynamicMenu />",
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
    title: "Sidebar Collapse",
    category: "Навигация",
    description:
      "Боковая навигация студии с рабочей областью выбранного раздела.",
    gesture: "Смените раздел и сверните панель",
    usage: "<SidebarCollapse />",
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
    title: "Pagination Dots",
    category: "Навигация",
    description: "Перейдите к другой странице",
    gesture: "Перейдите к другой странице",
    usage: "<PaginationDots />",
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
    title: "Command Palette",
    category: "Навигация",
    description: "Найдите и выполните команду",
    gesture: "Найдите и выполните команду",
    usage: "<CommandPalette />",
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
    title: "Step Progress",
    category: "Навигация",
    description: "Перейдите к следующему этапу",
    gesture: "Перейдите к следующему этапу",
    usage: "<StepProgress />",
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
    title: "Toolbar",
    category: "Навигация",
    description: "Включите стили текста",
    gesture: "Включите стили текста",
    usage: "<Toolbar />",
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
    title: "Morph Popover",
    category: "Кнопки",
    description: "Оставьте отзыв: кнопка развернётся в форму",
    gesture: "Оставьте отзыв: кнопка развернётся в форму",
    usage: "<MorphPopover />",
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
    title: "Letter Limit",
    category: "Ввод",
    description: "Введите текст до лимита",
    gesture: "Введите текст до лимита",
    usage: "<LetterLimit />",
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
    title: "Springy Input",
    category: "Ввод",
    description: "Нажмите на поле и начните ввод",
    gesture: "Нажмите на поле и начните ввод",
    usage: "<SpringyInput />",
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
    title: "OTP Code",
    category: "Ввод",
    description: "Введите или вставьте цифровой код",
    gesture: "Введите или вставьте цифровой код",
    usage: "<OtpCode />",
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
    title: "Star Rating",
    category: "Ввод",
    description: "Оцените от одной до пяти звёзд",
    gesture: "Оцените от одной до пяти звёзд",
    usage: "<StarRating />",
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
    title: "Tag Input",
    category: "Ввод",
    description: "Введите метку и нажмите Enter",
    gesture: "Введите метку и нажмите Enter",
    usage: "<TagInput />",
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
    title: "Password Strength",
    category: "Ввод",
    description: "Проверьте индикатор при вводе",
    gesture: "Проверьте индикатор при вводе",
    usage: "<PasswordStrength />",
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
    title: "Checkbox List",
    category: "Ввод",
    description: "Отметьте выполненные пункты",
    gesture: "Отметьте выполненные пункты",
    usage: "<CheckboxList />",
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
    title: "Jelly Slider",
    category: "Ввод",
    description: "Потяните упругий бегунок",
    gesture: "Потяните упругий бегунок",
    usage: "<JellySlider />",
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
    title: "Detent Dial",
    category: "Ввод",
    description: "Поверните регулятор стрелками или свайпом",
    gesture: "Поверните регулятор стрелками или свайпом",
    usage: "<DetentDial />",
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
    title: "Exposure Slider",
    category: "Ввод",
    description:
      "Шкала в EV управляет яркостью фотографии. Исходную экспозицию можно восстановить.",
    gesture: "Настройте экспозицию и сравните с оригиналом",
    usage: "<ExposureSlider />",
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
    title: "Wheel Picker",
    category: "Ввод",
    description: "Прокрутите список до нужного значения",
    gesture: "Прокрутите список до нужного значения",
    usage: "<WheelPicker />",
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
    title: "Scrubber",
    category: "Ввод",
    description: "Прокрутите шкалу времени",
    gesture: "Прокрутите шкалу времени",
    usage: "<Scrubber />",
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
    title: "Receipt Printer",
    category: "Карточки",
    description:
      "Подтверждение оплаты с анимацией термопринтера и повторной печатью чека.",
    gesture: "Оплатите демозаказ и посмотрите, как выходит чек",
    usage: "<ReceiptPrinter />",
    references: [],
    symbol: "ReceiptPrinter",
  },
  {
    slug: "card-field",
    title: "Card Field",
    category: "Ввод",
    description: "Попробуйте тестовую карту",
    gesture: "Попробуйте тестовую карту",
    usage: "<CardField />",
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
    title: "Signature Pad",
    category: "Ввод",
    description: "Нарисуйте подпись и сохраните результат",
    gesture: "Нарисуйте подпись и попробуйте отменить штрих",
    usage: "<SignaturePad />",
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
    title: "Parallax Ticket",
    category: "Карточки",
    description: "Наклоните билет курсором",
    gesture: "Наклоните билет курсором",
    usage: "<ParallaxTicket />",
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
    title: "Glass Lens",
    category: "Карточки",
    description: "Перемещайте линзу по рисунку",
    gesture: "Перемещайте линзу, нажмите для увеличения",
    usage: "<GlassLens />",
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
    title: "Pull Refresh",
    category: "Карточки",
    description:
      "Синхронизация файла с предварительным натяжением и отменой короткого жеста.",
    gesture: "Потяните список вниз, затем отпустите",
    usage: "<PullRefresh />",
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
    title: "Expand Card",
    category: "Карточки",
    description: "Выберите коллекцию, чтобы развернуть обложку и детали",
    gesture: "Выберите коллекцию, чтобы развернуть обложку и детали",
    usage: "<ExpandCard />",
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
    title: "Fan Cards",
    category: "Карточки",
    description:
      "Колода раскрывается веером и мягко приподнимает карту под указателем.",
    gesture: "Раскройте колоду и проведите по картам",
    usage: "<FanCards />",
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
    title: "Profile Card",
    category: "Карточки",
    description: "Подпишитесь и посмотрите, как меняются счётчик и кнопки",
    gesture: "Подпишитесь и посмотрите, как меняются счётчик и кнопки",
    usage: "<ProfileCard />",
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
    title: "Boarding Pass",
    category: "Карточки",
    description:
      "Посадочный талон с маршрутом, номером выхода и раскрывающимся штрихкодом.",
    gesture: "Раскройте посадочный талон",
    usage: "<BoardingPass />",
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
    title: "Notification Stack",
    category: "Карточки",
    description: "Раскройте стопку или смахните уведомление",
    gesture: "Раскройте стопку или смахните уведомление",
    usage: "<NotificationStack />",
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
    title: "Page Flip",
    category: "Карточки",
    description: "Лист с двумя сторонами переворачивается вокруг корешка.",
    gesture: "Перелистните нажатием или стрелками",
    usage: "<PageFlip />",
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
    title: "Stack Panel",
    category: "Навигация",
    description: "Откройте проект и смахните вправо, чтобы вернуться",
    gesture: "Откройте проект и смахните вправо, чтобы вернуться",
    usage: "<StackPanel />",
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
    title: "Weight Wave",
    category: "Текст",
    description: "Проведите по буквам или нажмите",
    gesture: "Проведите по буквам или нажмите",
    usage: "<WeightWave />",
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
    title: "Goo Morph",
    category: "Текст",
    description: "Переключите текучую надпись",
    gesture: "Переключите текучую надпись",
    usage: "<GooMorph />",
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
    title: "Scramble Text",
    category: "Текст",
    description: "Расшифруйте строку",
    gesture: "Расшифруйте строку",
    usage: "<ScrambleText />",
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
    title: "Read Along",
    category: "Текст",
    description:
      "Слова подсвечиваются в ритме чтения с паузой и пошаговым переходом.",
    gesture: "Продвигайтесь по словам",
    usage: "<ReadAlong />",
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
    title: "Roll Links",
    category: "Текст",
    description: "Наведите курсор или сфокусируйте ссылку",
    gesture: "Наведите курсор или сфокусируйте ссылку",
    usage: "<RollLinks />",
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
    title: "Marker Text",
    category: "Текст",
    description: "Выделите фразу маркером",
    gesture: "Выделите фразу маркером",
    usage: "<MarkerText />",
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
    title: "Dynamic Text",
    category: "Текст",
    description: "Смените слово в заголовке",
    gesture: "Смените слово в заголовке",
    usage: "<DynamicText />",
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
    title: "Typewriter",
    category: "Текст",
    description: "Запустите набор текста",
    gesture: "Запустите набор текста",
    usage: "<Typewriter />",
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
    title: "Music Toggle",
    category: "Кнопки",
    description: "Переключите анимацию эквалайзера",
    gesture: "Переключите анимацию эквалайзера",
    usage: "<MusicToggle />",
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
    title: "Prompt Box",
    category: "AI",
    description: "Введите запрос и отправьте",
    gesture: "Введите запрос и отправьте",
    usage: "<PromptBox />",
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
    title: "Streaming Reply",
    category: "AI",
    description: "Покажите ответ по частям",
    gesture: "Покажите ответ по частям",
    usage: "<StreamingReply />",
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
    title: "Ghost Suggestion",
    category: "AI",
    description: "Начните ввод и примите подсказку стрелкой вправо",
    gesture: "Начните ввод и примите подсказку стрелкой вправо",
    usage: "<GhostSuggestion />",
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
    title: "Goo Thinking",
    category: "AI",
    description: "Нажмите на капли, чтобы раскрыть ответ",
    gesture: "Нажмите на капли, чтобы раскрыть ответ",
    usage: "<GooThinking />",
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
    title: "Agent Steps",
    category: "AI",
    description: "Проведите агента по этапам",
    gesture: "Проведите агента по этапам",
    usage: "<AgentSteps />",
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
    title: "Tool Approval",
    category: "AI",
    description: "Разрешите или отклоните действие",
    gesture: "Разрешите или отклоните действие",
    usage: "<ToolApproval />",
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
    title: "Thinking Text",
    category: "AI",
    description: "Включите текстовый индикатор",
    gesture: "Включите текстовый индикатор",
    usage: "<ThinkingText />",
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
    title: "Task List",
    category: "AI",
    description: "Пройдите очередь задач",
    gesture: "Пройдите очередь задач",
    usage: "<TaskList />",
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
    title: "Voice Input",
    category: "AI",
    description: "Запишите и прослушайте голосовую заметку",
    gesture: "Запишите и прослушайте голосовую заметку",
    usage: "<VoiceInput />",
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
    title: "Command Search",
    category: "Кнопки",
    description:
      "Кнопка раскрывается в поле поиска по клику или по ⌘/Ctrl + K.",
    gesture: "Нажмите и введите запрос",
    usage: "<CommandSearch onSearch={console.log} />",
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
    description: "Программа курса с выбором урока и возвратом к обучению.",
    gesture: "Выберите урок и откройте его", usage: "<LessonOutline />", references: [], symbol: "LessonOutline",
  },
  {
    slug: "code-exercise", title: "Code Exercise", category: "Обучение",
    description: "Редактор задания с запуском, проверкой тестов и разбором ошибки.",
    gesture: "Исправьте шаблон и проверьте решение", usage: "<CodeExercise />", references: [], symbol: "CodeExercise",
  },
  {
    slug: "run-console", title: "Run Console", category: "Обучение",
    description: "Состояния компиляции и выполнения с выводом, временем и остановкой.",
    gesture: "Запустите или остановите пример", usage: "<RunConsole />", references: [], symbol: "RunConsole",
  },
  {
    slug: "test-results", title: "Test Results", category: "Обучение",
    description: "Сравнение ожидаемого и полученного результата на конкретном входе.",
    gesture: "Выберите тест и сравните значения", usage: "<TestResults />", references: [], symbol: "TestResults",
  },
  {
    slug: "ask-tutor", title: "Ask Tutor", category: "Обучение",
    description: "Вопрос по материалу урока или ошибке с выбранными источниками.",
    gesture: "Задайте вопрос по уроку", usage: "<AskTutor />", references: [], symbol: "AskTutor",
  },
  {
    slug: "lesson-citation", title: "Lesson Citation", category: "Обучение",
    description: "Ссылка на конкретный фрагмент урока с возвратом к задаче.",
    gesture: "Откройте фрагмент урока", usage: "<LessonCitation />", references: [], symbol: "LessonCitation",
  },
  {
    slug: "predict-output", title: "Predict Output", category: "Обучение",
    description: "Прогноз вывода программы с проверкой ответа и объяснением.",
    gesture: "Выберите прогноз и сверьте его", usage: "<PredictOutput />", references: [], symbol: "PredictOutput",
  },
  {
    slug: "execution-trace", title: "Execution Trace", category: "Обучение",
    description: "Пошаговое выполнение с подсветкой строки и значений переменных.",
    gesture: "Пройдите код по шагам", usage: "<ExecutionTrace />", references: [], symbol: "ExecutionTrace",
  },
  {
    slug: "hint-ladder", title: "Hint Ladder", category: "Обучение",
    description: "Подсказки раскрываются по одной от вопроса до похожего примера.",
    gesture: "Открывайте подсказки по очереди", usage: "<HintLadder />", references: [], symbol: "HintLadder",
  },
] as const;
export type Entry = (typeof entries)[number];

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
