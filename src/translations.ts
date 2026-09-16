import { Language } from './types';

export interface Translations {
  appTitle: string;
  appSubtitle: string;
  heroTagline: string;
  heroBadge: string;
  heroDesc: string;
  features: {
    unlimited: { title: string; desc: string };
    formats: { title: string; desc: string };
    fast: { title: string; desc: string };
    secure: { title: string; desc: string };
  };
  whyChooseUs: string;
  whyUs: {
    interface: { title: string; desc: string };
    rename: { title: string; desc: string };
    quality: { title: string; desc: string };
    unlimited: { title: string; desc: string };
  };
  upload: {
    dragDrop: string;
    orChoose: string;
    chooseBtn: string;
    cameraBtn: string;
    pasteHint: string;
    privacyNote: string;
    addMore: string;
  };
  controls: {
    finalName: string;
    namePlaceholder: string;
    options: string;
    imageQuality: string;
    qualityVeryHigh: string;
    qualityHigh: string;
    qualityMedium: string;
    orientation: string;
    orientationAuto: string;
    orientationPortrait: string;
    orientationLandscape: string;
    pageSize: string;
    margins: string;
    marginNone: string;
    marginSmall: string;
    marginNormal: string;
    marginLarge: string;
    convertBtn: string;
    converting: string;
    advancedSettings: string;
    pageNumbers: string;
    watermark: string;
    watermarkPlaceholder: string;
    headerTitle: string;
    headerTitlePlaceholder: string;
  };
  manage: {
    filesCount: string;
    reorderHint: string;
    clearAll: string;
    rotate: string;
    delete: string;
    edit: string;
    page: string;
    position: string;
    moveUp: string;
    moveDown: string;
    reverseOrder: string;
    sortByName: string;
    filterApplied: string;
  };
  filters: {
    original: string;
    grayscale: string;
    scanner: string;
    contrast: string;
    sepia: string;
  };
  camera: {
    title: string;
    capture: string;
    retake: string;
    keep: string;
    switchCam: string;
    close: string;
    cameraError: string;
  };
  editor: {
    title: string;
    brightness: string;
    contrast: string;
    rotation: string;
    filter: string;
    cropDoc: string;
    autoDetectEdges: string;
    detectingEdges: string;
    edgesDetected: string;
    resetCrop: string;
    flipH: string;
    flipV: string;
    reset: string;
    save: string;
    cancel: string;
  };
  ai: {
    settingsTitle: string;
    apiKeyLabel: string;
    apiKeyPlaceholder: string;
    saveKey: string;
    removeKey: string;
    keySaved: string;
    keyRemoved: string;
    testKey: string;
    testing: string;
    testSuccess: string;
    testFailed: string;
    howToGetTitle: string;
    steps: {
      step1: string;
      step2: string;
      step3: string;
      step4: string;
    };
    directLink: string;
    privacyNotice: string;
    aiFeaturesTitle: string;
    smartRenameBtn: string;
    analyzingImage: string;
    ocrSummaryBtn: string;
    ocrModalTitle: string;
    ocrClose: string;
    copyText: string;
    textCopied: string;
    disabledNote: string;
    detectEdgesAiBtn: string;
    autoRenameToggleOn: string;
    autoRenameToggleOff: string;
    autoRenameDesc: string;
    manualNameActive: string;
    resetToAiName: string;
    aiDetectedBadge: string;
  };
  exports: {
    format: string;
    pdfDesc: string;
    pptxTitle: string;
    pptxDesc: string;
    zipTitle: string;
    zipDesc: string;
    downloadPptx: string;
    downloadZip: string;
    generatingPptx: string;
    generatingZip: string;
  };
  share: {
    title: string;
    desc: string;
    quickShare: string;
    whatsapp: string;
    telegram: string;
    email: string;
    download: string;
    preview: string;
    copyFile: string;
    close: string;
    shareSuccess: string;
    copySuccess: string;
  };
  instructions: {
    title: string;
    items: string[];
    understood: string;
  };
  devFooter: {
    devBy: string;
    nameAr: string;
    nameEn: string;
    withLove: string;
  };
  toasts: {
    filesAdded: string;
    pdfAdded: string;
    pdfError: string;
    imageDeleted: string;
    allCleared: string;
    selectPrompt: string;
    pdfGenerated: string;
    processError: string;
    clipboardPasted: string;
  };
  nav: {
    home: string;
    instructions: string;
    aiSettings: string;
  };
}

export const translations: Record<Language, Translations> = {
  ar: {
    appTitle: 'Image → PDF Pro',
    appSubtitle: 'صورك في ملف واحد احترافي',
    heroTagline: 'محول ومحرر PDF الذكي',
    heroBadge: 'أداة احترافية وسهلة الاستخدام 100% مجانية',
    heroDesc: 'أضف عدداً غير محدود من الصور، أو ارفع ملف PDF وادمج معه صورك الجديدة. تحرير، فلاتر للمستندات، إعادة ترتيب ذكي، وميزات الذكاء الاصطناعي مع الحفاظ التام على خصوصيتك داخل متصفحك.',
    features: {
      unlimited: { title: 'عدد غير محدود', desc: 'من الصور في ملف PDF واحد' },
      formats: { title: 'جميع الصيغ', desc: 'JPG · PNG · WebP · GIF · BMP · PDF' },
      fast: { title: 'سريع للغاية', desc: 'تحويل فوري في ثوانٍ معدودة' },
      secure: { title: 'آمن وموثوق', desc: 'خصوصيتك محفوظة 100% داخل جهازك' }
    },
    whyChooseUs: 'لماذا تختار محولنا المتطور؟',
    whyUs: {
      interface: { title: 'واجهة فائقة السلاسة', desc: 'مصممة لتناسب الهاتف والكمبيوتر بدقة' },
      rename: { title: 'تسمية وتحكم كامل', desc: 'تحكم باسم الملف وجودته وهوامشه' },
      quality: { title: 'جودة وطباعة فائقة', desc: 'حافظ على حدة ووضوح الأوراق والمستندات' },
      unlimited: { title: 'دمج وتعديل متكامل', desc: 'فلاتر مسح ضوئي وتدوير وترتيب سلس' }
    },
    upload: {
      dragDrop: 'اسحب الملفات وأفلتها هنا',
      orChoose: 'أو اختر من جهازك (صور متعددة أو ملف PDF)',
      chooseBtn: 'اختر الصور أو الملفات',
      cameraBtn: 'تصوير مباشر بالكاميرا',
      pasteHint: 'أو اضغط Ctrl+V للصق صورة مباشرة من الحافظة',
      privacyNote: 'المعالجة تتم محلياً في متصفحك — بدون رفع صورك إلى خوادم خارجية',
      addMore: 'إضافة المزيد من الصور'
    },
    controls: {
      finalName: 'اسم ملف الـ PDF النهائي',
      namePlaceholder: 'اكتب اسم الملف...',
      options: 'خيارات وتنسيق الصفحة',
      imageQuality: 'جودة الصور',
      qualityVeryHigh: 'عالية جداً (أقصى دقة)',
      qualityHigh: 'عالية (موصى بها)',
      qualityMedium: 'متوسطة (حجم خفيف)',
      orientation: 'اتجاه الصفحة',
      orientationAuto: 'تلقائي ذكي',
      orientationPortrait: 'عمودي (Portrait)',
      orientationLandscape: 'أفقي (Landscape)',
      pageSize: 'مقاس الصفحة',
      margins: 'الهوامش',
      marginNone: 'بدون هوامش',
      marginSmall: 'صغيرة (5 مم)',
      marginNormal: 'عادية (10 مم)',
      marginLarge: 'كبيرة (20 مم)',
      convertBtn: 'تحويل وإنشاء PDF',
      converting: 'جاري المعالجة...',
      advancedSettings: 'خيارات متقدمة (ترقيم، علامة مائية)',
      pageNumbers: 'إضافة أرقام الصفحات (صفحة X من Y)',
      watermark: 'علامة مائية نصية',
      watermarkPlaceholder: 'مثال: سري، مسودة، نموذج...',
      headerTitle: 'عنوان أعلى الصفحة',
      headerTitlePlaceholder: 'عنوان المستند في رأس الصفحة'
    },
    manage: {
      filesCount: 'الملفات المجهزة',
      reorderHint: 'اسحب البطاقة أو استخدم الأسهم لإعادة الترتيب',
      clearAll: 'مسح الكل',
      rotate: 'تدوير 90°',
      delete: 'حذف',
      edit: 'تعديل وفلاتر',
      page: 'صفحة',
      position: 'ترتيب',
      moveUp: 'تقديم',
      moveDown: 'تأخير',
      reverseOrder: 'عكس الترتيب',
      sortByName: 'فرز حسب الاسم',
      filterApplied: 'فلتر نشط'
    },
    filters: {
      original: 'الأصلية',
      grayscale: 'أبيض وأسود تدرج رمادي',
      scanner: 'ماسح مستندات عالي التباين',
      contrast: 'تعزيز الوضوح',
      sepia: 'دافئ (Sepia)'
    },
    camera: {
      title: 'التقاط مستند عبر الكاميرا',
      capture: 'التقاط الصورة',
      retake: 'إعادة الالتقاط',
      keep: 'اعتماد وإضافة',
      switchCam: 'تبديل الكاميرا',
      close: 'إلغاء',
      cameraError: 'تعذر تشغيل الكاميرا، يرجى منح الإذن في المتصفح.'
    },
    editor: {
      title: 'تحرير وضبط الصورة',
      brightness: 'السطوع',
      contrast: 'التباين',
      rotation: 'التدوير',
      filter: 'فلتر المستند',
      cropDoc: 'قص وتحديد أطراف الورقة',
      autoDetectEdges: 'تحديد ذكي فوري لأطراف الورقة 📐',
      detectingEdges: 'جاري فحص وتحديد الحواف بدقة...',
      edgesDetected: 'تم التقاط حدود المستند بنجاح!',
      resetCrop: 'إلغاء القص وعرض الصورة كاملة',
      flipH: 'قلب أفقي',
      flipV: 'قلب عمودي',
      reset: 'إعادة ضبط',
      save: 'تطبيق التعديلات',
      cancel: 'إلغاء'
    },
    ai: {
      settingsTitle: 'إعدادات الذكاء الاصطناعي (Google AI Studio)',
      apiKeyLabel: 'مفتاح API الخاص بك (Gemini API Key)',
      apiKeyPlaceholder: 'ألصق مفتاح AI Studio هنا...',
      saveKey: 'حفظ المفتاح',
      removeKey: 'حذف المفتاح',
      keySaved: 'تم حفظ المفتاح بنجاح في متصفحك!',
      keyRemoved: 'تم حذف المفتاح.',
      testKey: 'فحص صلاحية المفتاح',
      testing: 'جاري الفحص...',
      testSuccess: 'المفتاح سليم ويعمل بنجاح!',
      testFailed: 'المفتاح غير صالح أو انتهت صلاحيته.',
      howToGetTitle: 'كيف تحصل على مفتاحك مجاناً وبكل سهولة؟',
      steps: {
        step1: '1. اضغط على الرابط المباشر أدناه للدخول إلى Google AI Studio.',
        step2: '2. سجّل الدخول بحساب Google (أو أنشئ حساباً جديداً إذا لم تكن مسجلاً).',
        step3: '3. اضغط على زر "Create API Key" (إنشاء مفتاح).',
        step4: '4. انسخ المفتاح وألصقه هنا لتفعيل الميزات الذكية فوراً مجاناً!'
      },
      directLink: 'الانتقال إلى Google AI Studio للحصول على المفتاح ↗',
      privacyNotice: 'مفتاحك يُحفظ محلياً داخل جهازك فقط لضمان الخصوصية التامة ودون أي تكاليف.',
      aiFeaturesTitle: 'الميزات الذكية المتاحة:',
      smartRenameBtn: 'تسمية ذكية للملف (AI)',
      analyzingImage: 'الذكاء الاصطناعي يحلل المستند...',
      ocrSummaryBtn: 'استخراج وتلخيص النص (AI OCR)',
      ocrModalTitle: 'النص المستخرج والملخص الذكي',
      ocrClose: 'إغلاق',
      copyText: 'نسخ النص',
      textCopied: 'تم نسخ النص إلى الحافظة!',
      disabledNote: 'جميع ميزات تحويل الصور والـ PDF تعمل 100% بدون أي مفتاح ذكاء اصطناعي.',
      detectEdgesAiBtn: 'اكتشاف حدود الورق بالذكاء الاصطناعي (AI Scanner)',
      autoRenameToggleOn: 'التسمية الذكية التلقائية: مفعّلة',
      autoRenameToggleOff: 'التسمية الذكية التلقائية: معطّلة',
      autoRenameDesc: 'يتعرف على نوع المستند والبيانات ويسمي ملف الـ PDF تلقائياً ما لم تقم بتعديل الاسم بنفسك',
      manualNameActive: 'تم تثبيت الاسم المخصص الذي أدخلته يدوياً',
      resetToAiName: 'العودة للتسمية الذكية',
      aiDetectedBadge: 'التعرف الذكي:'
    },
    exports: {
      format: 'صيغة التصدير',
      pdfDesc: 'ملف PDF متكامل ومضغوط للطباعة والمشاركة',
      pptxTitle: 'عرض تقديمي PowerPoint (PPTX)',
      pptxDesc: 'تحويل كل صورة إلى شريحة عرض تقديمي احترافية',
      zipTitle: 'أرشيف مضغوط (ZIP)',
      zipDesc: 'تنزيل جميع الصور المحسنة والمرقمة في ملف واحد',
      downloadPptx: 'تصدير كـ PowerPoint (PPTX)',
      downloadZip: 'تنزيل كـ أرشيف ZIP',
      generatingPptx: 'جاري إنشاء عرض PowerPoint...',
      generatingZip: 'جاري ضغط الملفات...'
    },
    share: {
      title: 'تم إنشاء ملف PDF بنجاح! 🎉',
      desc: 'يمكنك الآن معاينة الملف، تنزيله، أو مشاركته فوراً',
      quickShare: 'مشاركة سريعة (Web Share)',
      whatsapp: 'واتساب',
      telegram: 'تليجرام',
      email: 'البريد الإلكتروني',
      download: 'تنزيل PDF',
      preview: 'معاينة الملف',
      copyFile: 'نسخ الملف',
      close: 'إغلاق',
      shareSuccess: 'تم فتح نافذة المشاركة',
      copySuccess: 'تم نسخ الملف إلى الحافظة!'
    },
    instructions: {
      title: 'دليل استخدام الموقع السريع',
      items: [
        'اضغط على زر "اختر الصور أو الملفات" أو اسحب الملفات مباشرة إلى المربع.',
        'يمكنك رفع صور بصيغ متعددة (JPG, PNG, WebP, GIF, BMP) أو رفع ملف PDF لدمج صور إضافية معه.',
        'استخدم زر الكاميرا لتصوير الإيصالات والشهادات والأوراق الورقية فوراً من هاتفك.',
        'اضغط على أي صورة لتعديل السطوع، التباين، أو تطبيق فلتر الماسح الضوئي (Document Scanner).',
        'اسحب البطاقات لترتيب صفحات الـ PDF بالطريقة التي ترغب بها.',
        'اختر مقاس الصفحة (A4، Letter، أو مقاس الصورة الأصلي)، واتجاه الصفحة والهوامش والترقيم.',
        'إذا رغبت بتفعيل الذكاء الاصطناعي لتسمية الملفات تلقائياً أو استخراج النصوص، يمكنك إضافة مفتاحك الشخصي المجاني من إعدادات الذكاء الاصطناعي.',
        'اضغط "تحويل وإنشاء PDF" ثم شارك الملف أو نزله بضغطة واحدة!'
      ],
      understood: 'فهمت، ابدأ الآن'
    },
    devFooter: {
      devBy: 'تطوير',
      nameAr: 'محمد نبيل السحيقي',
      nameEn: 'Mohammed Nabil Al-Suhaigi',
      withLove: 'بكل حب .. لخدمتكم'
    },
    toasts: {
      filesAdded: 'تمت إضافة الصور بنجاح',
      pdfAdded: 'تم إرفاق ملف PDF للدمج بنجاح',
      pdfError: 'تعذر قراءة ملف الـ PDF',
      imageDeleted: 'تم حذف العنصر',
      allCleared: 'تم مسح كافة الملفات',
      selectPrompt: 'يرجى إضافة صورة واحدة على الأقل',
      pdfGenerated: 'تم إنشاء ملف الـ PDF بنجاح!',
      processError: 'حدث خطأ أثناء المعالجة، يرجى المحاولة ثانية',
      clipboardPasted: 'تم لصق الصورة من الحافظة بنجاح'
    },
    nav: {
      home: 'الرئيسية',
      instructions: 'تعليمات',
      aiSettings: 'إعدادات الذكاء الاصطناعي'
    }
  },
  en: {
    appTitle: 'Image → PDF Pro',
    appSubtitle: 'All your images in one professional PDF',
    heroTagline: 'Smart PDF Converter & Editor',
    heroBadge: '100% Free & Professional Tool',
    heroDesc: 'Add unlimited images, or merge an existing PDF with your new images. Crop, rotate, apply document scanner filters, reorder easily, and unlock optional AI features while keeping 100% privacy in your browser.',
    features: {
      unlimited: { title: 'Unlimited Images', desc: 'Combine endless photos in one PDF' },
      formats: { title: 'All Formats', desc: 'JPG · PNG · WebP · GIF · BMP · PDF' },
      fast: { title: 'Ultra Fast', desc: 'Instant conversion within seconds' },
      secure: { title: 'Safe & Private', desc: 'Processed 100% locally in your device' }
    },
    whyChooseUs: 'Why Choose Our Advanced Tool?',
    whyUs: {
      interface: { title: 'Smooth Modern UI', desc: 'Optimized for mobile & desktop alike' },
      rename: { title: 'Full Control', desc: 'Custom file name, quality & margins' },
      quality: { title: 'High-Res Output', desc: 'Keep receipts and documents crystal sharp' },
      unlimited: { title: 'Integrated Editing', desc: 'Document filters, crop & quick reorder' }
    },
    upload: {
      dragDrop: 'Drag and drop files here',
      orChoose: 'or select from your device (Images or PDF)',
      chooseBtn: 'Select Images / PDF',
      cameraBtn: 'Live Camera Capture',
      pasteHint: 'Or press Ctrl+V to paste an image directly from clipboard',
      privacyNote: 'Everything is processed locally in your browser — zero file uploads to servers',
      addMore: 'Add More Images'
    },
    controls: {
      finalName: 'Output PDF Name',
      namePlaceholder: 'Enter document name...',
      options: 'Page Layout & Options',
      imageQuality: 'Image Quality',
      qualityVeryHigh: 'Ultra High (Max resolution)',
      qualityHigh: 'High (Recommended)',
      qualityMedium: 'Medium (Lightweight)',
      orientation: 'Page Orientation',
      orientationAuto: 'Smart Auto',
      orientationPortrait: 'Portrait',
      orientationLandscape: 'Landscape',
      pageSize: 'Page Size',
      margins: 'Margins',
      marginNone: 'No Margins',
      marginSmall: 'Small (5 mm)',
      marginNormal: 'Normal (10 mm)',
      marginLarge: 'Large (20 mm)',
      convertBtn: 'Convert to PDF',
      converting: 'Converting...',
      advancedSettings: 'Advanced Options (Numbering, Watermark)',
      pageNumbers: 'Add Page Numbers (Page X of Y)',
      watermark: 'Text Watermark',
      watermarkPlaceholder: 'e.g. Confidential, Draft...',
      headerTitle: 'Header Title',
      headerTitlePlaceholder: 'Document title in header'
    },
    manage: {
      filesCount: 'Selected Files',
      reorderHint: 'Drag cards or use arrow buttons to reorder',
      clearAll: 'Clear All',
      rotate: 'Rotate 90°',
      delete: 'Delete',
      edit: 'Edit & Filter',
      page: 'Page',
      position: 'Pos',
      moveUp: 'Move Up',
      moveDown: 'Move Down',
      reverseOrder: 'Reverse Order',
      sortByName: 'Sort by Name',
      filterApplied: 'Filter Active'
    },
    filters: {
      original: 'Original',
      grayscale: 'Grayscale B&W',
      scanner: 'High-Contrast Document Scanner',
      contrast: 'Enhanced Contrast',
      sepia: 'Warm Sepia'
    },
    camera: {
      title: 'Capture Document with Camera',
      capture: 'Snap Photo',
      retake: 'Retake',
      keep: 'Add to PDF',
      switchCam: 'Switch Camera',
      close: 'Cancel',
      cameraError: 'Could not access camera. Please allow permission in browser.'
    },
    editor: {
      title: 'Edit & Enhance Image',
      brightness: 'Brightness',
      contrast: 'Contrast',
      rotation: 'Rotation',
      filter: 'Document Filter',
      cropDoc: 'Crop & Document Edge Detection',
      autoDetectEdges: 'Auto Detect Paper Edges 📐',
      detectingEdges: 'Scanning paper boundaries...',
      edgesDetected: 'Document borders detected successfully!',
      resetCrop: 'Reset Crop (Show Full Image)',
      flipH: 'Flip Horizontal',
      flipV: 'Flip Vertical',
      reset: 'Reset',
      save: 'Apply Changes',
      cancel: 'Cancel'
    },
    ai: {
      settingsTitle: 'AI Settings (Google AI Studio)',
      apiKeyLabel: 'Your Google Gemini API Key',
      apiKeyPlaceholder: 'Paste your Google AI Studio key here...',
      saveKey: 'Save Key',
      removeKey: 'Remove Key',
      keySaved: 'API Key saved securely in your browser!',
      keyRemoved: 'API Key removed.',
      testKey: 'Test API Key',
      testing: 'Testing key...',
      testSuccess: 'API Key is valid and working!',
      testFailed: 'Invalid API Key or expired quota.',
      howToGetTitle: 'How to get your free API key in 1 minute:',
      steps: {
        step1: '1. Click the direct link below to open Google AI Studio.',
        step2: '2. Sign in with any free Google Account (or register in seconds).',
        step3: '3. Click "Create API Key".',
        step4: '4. Copy the generated key and paste it here to unlock AI features!'
      },
      directLink: 'Open Google AI Studio to get Key ↗',
      privacyNotice: 'Your key is saved only in your local browser storage for total privacy and zero cost.',
      aiFeaturesTitle: 'Unlocked AI Capabilities:',
      smartRenameBtn: 'Smart AI Rename',
      analyzingImage: 'AI is analyzing your document...',
      ocrSummaryBtn: 'AI Text OCR & Summary',
      ocrModalTitle: 'Extracted Text & AI Summary',
      ocrClose: 'Close',
      copyText: 'Copy Text',
      textCopied: 'Text copied to clipboard!',
      disabledNote: 'All PDF converting and merging features work 100% without any API key.',
      detectEdgesAiBtn: 'AI Document Edge & Paper Detection',
      autoRenameToggleOn: 'Smart AI Auto-Naming: ON',
      autoRenameToggleOff: 'Smart AI Auto-Naming: OFF',
      autoRenameDesc: 'Inspects images to automatically name the PDF unless you manually enter a custom name',
      manualNameActive: 'Custom name entered manually (protected from auto-overwrite)',
      resetToAiName: 'Reset to AI Smart Name',
      aiDetectedBadge: 'AI Identified:'
    },
    exports: {
      format: 'Export Format',
      pdfDesc: 'Complete, optimized PDF for print and sharing',
      pptxTitle: 'PowerPoint Presentation (PPTX)',
      pptxDesc: 'Convert each image to a crisp presentation slide',
      zipTitle: 'Compressed Archive (ZIP)',
      zipDesc: 'Download all processed images in a single package',
      downloadPptx: 'Export as PowerPoint (PPTX)',
      downloadZip: 'Download ZIP Archive',
      generatingPptx: 'Creating PowerPoint slides...',
      generatingZip: 'Compressing files...'
    },
    share: {
      title: 'PDF Created Successfully! 🎉',
      desc: 'You can now preview, download, or share your document',
      quickShare: 'Quick Share (Web Share)',
      whatsapp: 'WhatsApp',
      telegram: 'Telegram',
      email: 'Email',
      download: 'Download PDF',
      preview: 'Preview PDF',
      copyFile: 'Copy File',
      close: 'Close',
      shareSuccess: 'Share window opened',
      copySuccess: 'File copied to clipboard!'
    },
    instructions: {
      title: 'Quick User Guide',
      items: [
        'Click "Select Images / PDF" or drag and drop files into the box.',
        'Supports all popular formats (JPG, PNG, WebP, GIF, BMP) or existing PDFs for merging.',
        'Use the live camera button to snap receipts, bills, and documents right from your smartphone.',
        'Click on any image to adjust brightness, contrast, or apply the Document Scanner filter.',
        'Drag items or use the navigation arrows to set the exact order of pages.',
        'Customize page size (A4, Letter, Fit), orientation, margins, and page numbers.',
        'If you wish to enable smart AI renaming or text OCR, you can optionally add your free Google AI Studio key in AI Settings.',
        'Click "Convert to PDF" and download or share directly via WhatsApp, Telegram, or Email!'
      ],
      understood: 'Got it, let\'s start'
    },
    devFooter: {
      devBy: 'DEVELOPED BY',
      nameAr: 'محمد نبيل السحيقي',
      nameEn: 'Mohammed Nabil Al-Suhaigi',
      withLove: 'Crafted with passion to serve you'
    },
    toasts: {
      filesAdded: 'Images added successfully',
      pdfAdded: 'PDF document attached for merging',
      pdfError: 'Failed to read PDF file',
      imageDeleted: 'Item deleted',
      allCleared: 'All files cleared',
      selectPrompt: 'Please add at least one image or PDF',
      pdfGenerated: 'PDF generated successfully!',
      processError: 'Error processing PDF, please try again',
      clipboardPasted: 'Image pasted from clipboard'
    },
    nav: {
      home: 'Home',
      instructions: 'Instructions',
      aiSettings: 'AI Settings'
    }
  },
  fr: {
    appTitle: 'Image → PDF Pro',
    appSubtitle: 'Toutes vos images en un seul PDF professionnel',
    heroTagline: 'Convertisseur & Éditeur PDF Intelligent',
    heroBadge: 'Outil 100% Gratuit & Professionnel',
    heroDesc: 'Ajoutez un nombre illimité d\'images ou fusionnez un fichier PDF existant avec vos nouvelles photos. Recadrage, filtres pour documents, réorganisation facile et fonctionnalités d\'IA optionnelles tout en préservant votre confidentialité dans votre navigateur.',
    features: {
      unlimited: { title: 'Images Illimitées', desc: 'Regroupez autant de photos que souhaité' },
      formats: { title: 'Tous les Formats', desc: 'JPG · PNG · WebP · GIF · BMP · PDF' },
      fast: { title: 'Ultra Rapide', desc: 'Conversion instantanée en quelques secondes' },
      secure: { title: 'Sécurisé & Privé', desc: 'Traité 100% localement sur votre appareil' }
    },
    whyChooseUs: 'Pourquoi Choisir Notre Outil ?',
    whyUs: {
      interface: { title: 'Interface Fluide & Moderne', desc: 'Optimisée pour smartphone et ordinateur' },
      rename: { title: 'Contrôle Total', desc: 'Personnalisez le nom, la qualité et les marges' },
      quality: { title: 'Haute Résolution', desc: 'Conservez la netteté de vos documents et reçus' },
      unlimited: { title: 'Édition Complète', desc: 'Filtres de numérisation, rotation et tri rapide' }
    },
    upload: {
      dragDrop: 'Glissez et déposez vos fichiers ici',
      orChoose: 'ou choisissez depuis votre appareil (Images ou PDF)',
      chooseBtn: 'Choisir Images / PDF',
      cameraBtn: 'Prise de Vue par Caméra',
      pasteHint: 'Ou appuyez sur Ctrl+V pour coller une image du presse-papier',
      privacyNote: 'Tout est traité localement dans votre navigateur — aucun envoi sur des serveurs',
      addMore: 'Ajouter d\'Autres Images'
    },
    controls: {
      finalName: 'Nom du Fichier PDF',
      namePlaceholder: 'Entrez le nom du document...',
      options: 'Mise en Page & Options',
      imageQuality: 'Qualité d\'Image',
      qualityVeryHigh: 'Très Élevée (Résolution max)',
      qualityHigh: 'Élevée (Recommandée)',
      qualityMedium: 'Moyenne (Fichier léger)',
      orientation: 'Orientation de la Page',
      orientationAuto: 'Auto Intelligent',
      orientationPortrait: 'Portrait (Vertical)',
      orientationLandscape: 'Paysage (Horizontal)',
      pageSize: 'Taille de la Page',
      margins: 'Marges',
      marginNone: 'Sans marges',
      marginSmall: 'Petites (5 mm)',
      marginNormal: 'Normales (10 mm)',
      marginLarge: 'Grandes (20 mm)',
      convertBtn: 'Convertir en PDF',
      converting: 'Conversion en cours...',
      advancedSettings: 'Options Avancées (Pagination, Filigrane)',
      pageNumbers: 'Ajouter les numéros de page (Page X sur Y)',
      watermark: 'Filigrane Texte',
      watermarkPlaceholder: 'ex: Confidentiel, Brouillon...',
      headerTitle: 'Titre d\'En-tête',
      headerTitlePlaceholder: 'Titre du document en haut de page'
    },
    manage: {
      filesCount: 'Fichiers Prêts',
      reorderHint: 'Faites glisser les cartes ou utilisez les flèches pour réordonner',
      clearAll: 'Tout Effacer',
      rotate: 'Pivoter 90°',
      delete: 'Supprimer',
      edit: 'Modifier & Filtres',
      page: 'Page',
      position: 'Pos',
      moveUp: 'Avancer',
      moveDown: 'Reculer',
      reverseOrder: 'Inverser l\'Ordre',
      sortByName: 'Trier par Nom',
      filterApplied: 'Filtre Actif'
    },
    filters: {
      original: 'Originale',
      grayscale: 'Niveaux de Gris',
      scanner: 'Scanner de Document Haut Contraste',
      contrast: 'Contraste Amélioré',
      sepia: 'Sépia Chaud'
    },
    camera: {
      title: 'Photographier un Document',
      capture: 'Prendre la Photo',
      retake: 'Reprendre',
      keep: 'Ajouter au PDF',
      switchCam: 'Changer de Caméra',
      close: 'Annuler',
      cameraError: 'Impossible d\'accéder à la caméra. Veuillez autoriser l\'accès dans le navigateur.'
    },
    editor: {
      title: 'Modifier & Améliorer l\'Image',
      brightness: 'Luminosité',
      contrast: 'Contraste',
      rotation: 'Rotation',
      filter: 'Filtre de Document',
      cropDoc: 'Rogner & Détecter les Bords du Document',
      autoDetectEdges: 'Détection Auto des Bords du Papier 📐',
      detectingEdges: 'Analyse des bords du document...',
      edgesDetected: 'Bords du document détectés avec succès !',
      resetCrop: 'Réinitialiser le rognage (Pleine image)',
      flipH: 'Miroir Horizontal',
      flipV: 'Miroir Vertical',
      reset: 'Réinitialiser',
      save: 'Appliquer les Modifications',
      cancel: 'Annuler'
    },
    ai: {
      settingsTitle: 'Paramètres IA (Google AI Studio)',
      apiKeyLabel: 'Votre Clé API Gemini (Google AI Studio)',
      apiKeyPlaceholder: 'Collez votre clé Google AI Studio ici...',
      saveKey: 'Enregistrer la Clé',
      removeKey: 'Supprimer la Clé',
      keySaved: 'Clé API enregistrée en toute sécurité dans votre navigateur !',
      keyRemoved: 'Clé API supprimée.',
      testKey: 'Tester la Clé API',
      testing: 'Test en cours...',
      testSuccess: 'Clé API valide et fonctionnelle !',
      testFailed: 'Clé API invalide ou quota dépassé.',
      howToGetTitle: 'Comment obtenir votre clé API gratuite en 1 minute :',
      steps: {
        step1: '1. Cliquez sur le lien direct ci-dessous pour ouvrir Google AI Studio.',
        step2: '2. Connectez-vous avec n\'importe quel compte Google gratuit.',
        step3: '3. Cliquez sur "Create API Key" (Créer une clé API).',
        step4: '4. Copiez la clé générée et collez-la ici pour activer les fonctionnalités IA !'
      },
      directLink: 'Accéder à Google AI Studio pour obtenir la clé ↗',
      privacyNotice: 'Votre clé est stockée uniquement sur votre navigateur local pour une confidentialité totale et sans aucun coût.',
      aiFeaturesTitle: 'Fonctionnalités IA Disponibles :',
      smartRenameBtn: 'Renommage Intelligent (IA)',
      analyzingImage: 'L\'IA analyse votre document...',
      ocrSummaryBtn: 'Extraction & Résumé de Texte (AI OCR)',
      ocrModalTitle: 'Texte Extrait & Résumé Intelligent',
      ocrClose: 'Fermer',
      copyText: 'Copier le Texte',
      textCopied: 'Texte copié dans le presse-papier !',
      disabledNote: 'Toutes les fonctions de conversion et de fusion de PDF fonctionnent à 100% sans aucune clé IA.',
      detectEdgesAiBtn: 'Détection des Bords par IA',
      autoRenameToggleOn: 'Nommage Auto Intelligent : Activé',
      autoRenameToggleOff: 'Nommage Auto Intelligent : Désactivé',
      autoRenameDesc: 'Analyse les images et nomme automatiquement le PDF tant que vous ne modifiez pas le nom manuellement',
      manualNameActive: 'Nom personnalisé saisi manuellement',
      resetToAiName: 'Revenir au nom suggéré par l\'IA',
      aiDetectedBadge: 'Identifié par IA :'
    },
    exports: {
      format: 'Format d\'Exportation',
      pdfDesc: 'Document PDF optimisé et prêt à imprimer',
      pptxTitle: 'Présentation PowerPoint (PPTX)',
      pptxDesc: 'Chaque image convertie en diapositive nette',
      zipTitle: 'Archive Compressée (ZIP)',
      zipDesc: 'Télécharger toutes les images traitées en un seul fichier',
      downloadPptx: 'Exporter en PowerPoint (PPTX)',
      downloadZip: 'Télécharger l\'archive ZIP',
      generatingPptx: 'Création des diapositives...',
      generatingZip: 'Compression des fichiers...'
    },
    share: {
      title: 'Fichier PDF Créé avec Succès ! 🎉',
      desc: 'Vous pouvez maintenant prévisualiser, télécharger ou partager votre document',
      quickShare: 'Partage Rapide (Web Share)',
      whatsapp: 'WhatsApp',
      telegram: 'Telegram',
      email: 'E-mail',
      download: 'Télécharger le PDF',
      preview: 'Aperçu du PDF',
      copyFile: 'Copier le Fichier',
      close: 'Fermer',
      shareSuccess: 'Fenêtre de partage ouverte',
      copySuccess: 'Fichier copié dans le presse-papier !'
    },
    instructions: {
      title: 'Guide d\'Utilisation Rapide',
      items: [
        'Cliquez sur "Choisir Images / PDF" ou glissez-déposez vos fichiers dans la zone.',
        'Prend en charge tous les formats courants (JPG, PNG, WebP, GIF, BMP) ainsi que les fichiers PDF existants pour fusion.',
        'Utilisez le bouton caméra pour photographier vos reçus et documents directement depuis votre téléphone.',
        'Cliquez sur n\'importe quelle image pour ajuster la luminosité, le contraste ou appliquer le filtre Scanner de Document.',
        'Déplacez les cartes ou utilisez les flèches pour définir l\'ordre exact des pages.',
        'Personnalisez le format de page (A4, Letter, Ajusté), l\'orientation, les marges et la numérotation.',
        'Pour activer le renommage automatique par IA ou l\'extraction de texte, ajoutez votre clé gratuite dans les paramètres IA.',
        'Cliquez sur "Convertir en PDF" puis téléchargez ou partagez en un clic via WhatsApp, Telegram ou E-mail !'
      ],
      understood: 'Compris, c\'est parti'
    },
    devFooter: {
      devBy: 'DÉVELOPPÉ PAR',
      nameAr: 'محمد نبيل السحيقي',
      nameEn: 'Mohammed Nabil Al-Suhaigi',
      withLove: 'Conçu avec passion pour vous servir'
    },
    toasts: {
      filesAdded: 'Images ajoutées avec succès',
      pdfAdded: 'Document PDF joint pour fusion',
      pdfError: 'Impossible de lire le fichier PDF',
      imageDeleted: 'Élément supprimé',
      allCleared: 'Tous les fichiers ont été effacés',
      selectPrompt: 'Veuillez ajouter au moins une image ou un PDF',
      pdfGenerated: 'Fichier PDF généré avec succès !',
      processError: 'Erreur lors de la génération du PDF, veuillez réessayer',
      clipboardPasted: 'Image collée depuis le presse-papier'
    },
    nav: {
      home: 'Accueil',
      instructions: 'Instructions',
      aiSettings: 'Paramètres IA'
    }
  }
};
