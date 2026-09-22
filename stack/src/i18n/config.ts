 import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  // =====================================================
  // ENGLISH
  // =====================================================
  en: {
    translation: {
      // -------------------------
      // Common
      // -------------------------
      home: "Home",
      questions: "Questions",
      users: "Users",
      login: "Log in",
      signup: "Sign up",
      askQuestion: "Ask Question",
      search: "Search",
      language: "Language",
      logout: "Logout",
      profile: "Profile",
      settings: "Settings",
      welcome: "Welcome",
      about: "About",
      products: "Products",
      forTeams: "For Teams",

      // -------------------------
      // Users
      // -------------------------
      noUsers: "No users found",
      filterByUser: "Filter by user",
      joined: "Joined",

      // -------------------------
      // Questions
      // -------------------------
      questionsPage: "Questions",
      topQuestions: "Top Questions",
      newest: "Newest",
      active: "Active",
      bountied: "Bountied",
      unanswered: "Unanswered",
      more: "More",
      filter: "Filter",
      noQuestions: "No questions found",
      votes: "votes",
      answer: "answer",
      answers: "answers",
      asked: "asked",

      // -------------------------
      // Ask Question
      // -------------------------
      askPublicQuestion: "Ask a public question",
      writingGoodQuestion: "Writing a good question",
      title: "Title",
      titleDescription:
        "Be specific and imagine you're asking a question to another person.",
      titlePlaceholder:
        "e.g. How to center a div in CSS?",
      problemDetails:
        "What are the details of your problem?",
      problemDescription:
        "Introduce the problem and expand on what you put in the title. Minimum 20 characters.",
      problemPlaceholder:
        "Describe your problem in detail...",
      tags: "Tags",
      tagsDescription:
        "Add up to 5 tags to describe what your question is about.",
      tagsPlaceholder:
        "e.g. javascript react nextjs",
      reviewQuestion:
        "Review your question",

      // -------------------------
      // Question Detail
      // -------------------------
      noQuestion: "Question not found",
      loginToContinue:
        "Please login to continue",
      voteUpdated:
        "Vote updated successfully",
      failedToVote:
        "Failed to update vote",
      answerUploaded:
        "Answer posted successfully",
      failedToAnswer:
        "Failed to post answer",
      confirmDeleteQuestion:
        "Are you sure you want to delete this question?",
      failedToDeleteQuestion:
        "Failed to delete question",
      confirmDeleteAnswer:
        "Are you sure you want to delete this answer?",
      deletedSuccessfully:
        "Deleted successfully",
      share: "Share",
      flag: "Flag",
      delete: "Delete",
      answered: "answered",
      yourAnswer: "Your Answer",
      writeAnswer:
        "Write your answer here...",
      posting: "Posting...",
      postYourAnswer:
        "Post Your Answer",
      byPosting:
        "By posting your answer, you agree to the",
      privacyPolicy:
        "privacy policy",
      and: "and",
      termsOfService:
        "terms of service",

      // =====================================================
      // SECURITY
      // =====================================================

      securityDeviceManagement:
        "Security & Device Management",

      securityDescription:
        "Manage your login history, active sessions, OTP verification and trusted devices.",

      loginHistory:
        "Login History",

      loginHistoryDescription:
        "View your recent login activity.",

      viewHistory:
        "View History",

      clickViewHistory:
        'Click "View History" to load login history.',

      successfulLogin:
        "Successful Login",

      failedLogin:
        "Failed Login",

      ipAddress:
        "IP Address",

      device:
        "Device",

      unknown:
        "Unknown",

      activeSessions:
        "Active Sessions",

      activeSessionsDescription:
        "Manage devices currently logged into your account.",

      viewSessions:
        "View Sessions",

      noActiveSessions:
        "No active sessions found.",

      activeDevice:
        "Active Device",

      ip:
        "IP",

      loginTime:
        "Login",

      unknownDevice:
        "Unknown device",

      revoke:
        "Revoke",

      otpVerification:
        "OTP Verification",

      otpVerificationDescription:
        "Generate and verify a one-time password.",

      enterYourEmail:
        "Enter your email",

      generateOtp:
        "Generate OTP",

      enterOtp:
        "Enter OTP",

      verifyOtp:
        "Verify OTP",

      trustedDevices:
        "Trusted Devices",

      trustedDevicesDescription:
        "Manage devices trusted for your account.",

      viewDevices:
        "View Devices",

      deviceNamePlaceholder:
        "Device name e.g. My Laptop",

      trustThisDevice:
        "Trust This Device",

      noTrustedDevices:
        "No trusted devices found.",

      trusted:
        "Trusted",

      remove:
        "Remove",

      loginHistoryLoaded:
        "Login history loaded",

      failedToLoadLoginHistory:
        "Failed to load login history",

      activeSessionsLoaded:
        "Active sessions loaded",

      failedToLoadSessions:
        "Failed to load sessions",

      failedToRevokeSession:
        "Failed to revoke session",

      pleaseEnterEmail:
        "Please enter your email",

      checkBackendTerminal:
        "Check your backend terminal for the OTP.",

      failedToGenerateOtp:
        "Failed to generate OTP",

      enterEmailAndOtp:
        "Enter email and OTP",

      otpVerificationFailed:
        "OTP verification failed",

      trustedDevicesLoaded:
        "Trusted devices loaded",

      failedToLoadTrustedDevices:
        "Failed to load trusted devices",

      failedToAddTrustedDevice:
        "Failed to add trusted device",

      failedToRemoveTrustedDevice:
        "Failed to remove trusted device",

      // =====================================================
      // USER PROFILE
      // =====================================================

      noUserFound:
        "No user found.",

      editProfile:
        "Edit Profile",

      basicInformation:
        "Basic Information",

      displayName:
        "Display Name",

      yourDisplayName:
        "Your display name",

      aboutMe:
        "About Me",

      aboutPlaceholder:
        "Tell us about yourself, your experience, and interests...",

      skillsAndTechnologies:
        "Skills & Technologies",

      addSkill:
        "Add a skill or technology",

      cancel:
        "Cancel",

      saveChanges:
        "Save Changes",

      memberSince:
        "Member since",

      goldBadges:
        "gold badges",

      silverBadges:
        "silver badges",

      bronzeBadges:
        "bronze badges",

      topTags:
        "Top Tags",

      profileUpdatedSuccessfully:
        "Profile updated successfully!",

      somethingWentWrong:
        "Something went wrong",

      // =====================================================
      // LOGIN PAGE
      // =====================================================

      verifyYourDevice:
        "Verify Your Device",

      enterOtpSentTo:
        "Enter the OTP sent to your email.",

      otp:
        "OTP",

      enterSixDigitOtp:
        "Enter 6-digit OTP",

      trustThisDeviceLogin:
        "Trust this device",

      verifying:
        "Verifying...",

      verifyDevice:
        "Verify OTP",

      otpValidFiveMinutes:
        "OTP is valid for 5 minutes.",

      logInToYourAccount:
        "Log in to your account",

      enterEmailPassword:
        "Enter your email and password to continue.",

      logInWithGoogle:
        "Log in with Google",

      logInWithGitHub:
        "Log in with GitHub",

      orContinueWith:
        "Or continue with",

      email:
        "Email",

      password:
        "Password",

      loading:
        "Loading...",

      forgotYourPassword:
        "Forgot your password?",

      dontHaveAccount:
        "Don't have an account?",

      allFieldsRequired:
        "All fields are required",

      pleaseEnterOtp:
        "Please enter the OTP",

      otpMustBeSixDigits:
        "OTP must be 6 digits",

      // =====================================================
      // FORGOT PASSWORD
      // =====================================================

      forgotPassword:
        "Forgot Password",

      forgotPasswordDescription:
        "Enter your registered email or phone number to receive an OTP.",

      forgotEnterEmailPhone:
        "Please enter your registered email or phone number.",

      otpSentSuccessfully:
        "OTP sent successfully.",

      failedToSendOtp:
        "Failed to send OTP.",

      passwordResetSuccessful:
        "Password Reset Successful",

      passwordResetDescription:
        "Your password has been reset successfully.",

      yourNewPassword:
        "Your New Password",

      savePassword:
        "Please save this password securely.",

      enterOtpDescription:
        "Enter the OTP sent to your registered contact.",

      phoneNumber:
        "Phone Number",

      registeredPhonePlaceholder:
        "Enter your registered phone number",

      registeredEmailPlaceholder:
        "Enter your registered email",

      otpPlaceholder:
        "Enter 6-digit OTP",

      otpValidity:
        "OTP is valid for 5 minutes.",

      changeEmail:
        "Change email",

      sending:
        "Sending...",

      sendOtp:
        "Send OTP",

      rememberPassword:
        "Remember your password?",

      invalidOtp:
        "Invalid OTP",

      // =====================================================
      // COMMUNITY
      // =====================================================

      communityFeed:
        "Community Feed",

      trending:
        "Trending",

      notifications:
        "Notifications",

      searchHashtag:
        "Search hashtag...",

      clear:
        "Clear",

      resultsFor:
        "Results for",

      noNotifications:
        "No notifications",

      trendingPosts:
        "Trending Posts",

      noTrendingPosts:
        "No trending posts",

      likes:
        "Likes",

      comments:
        "Comments",

      shares:
        "Shares",

      noPostsFound:
        "No posts found",

      follow:
        "Follow",

      saved:
        "Saved",

      bookmark:
        "Bookmark",

      edit:
        "Edit",

      report:
        "Report",

      reportReason:
        "Why are you reporting this post?",

      submitReport:
        "Submit Report",

      writeComment:
        "Write a comment...",

      comment:
        "Comment",

      writeReply:
        "Write a reply...",

      reply:
        "Reply",

      loadingMorePosts:
        "Loading more posts...",

      noMorePosts:
        "No more posts",

      confirmDeletePost:
        "Are you sure you want to delete this post?",

      enterReportReason:
        "Please enter a reason",

      postReportedSuccessfully:
        "Post reported successfully",

      followStatusUpdated:
        "Follow status updated",

      save:
        "Save",
    },
  },

  // =====================================================
  // SPANISH
  // =====================================================

  es: {
    translation: {
      home: "Inicio",
      questions: "Preguntas",
      users: "Usuarios",
      login: "Iniciar sesión",
      signup: "Registrarse",
      askQuestion: "Hacer una pregunta",
      search: "Buscar",
      language: "Idioma",
      logout: "Cerrar sesión",
      profile: "Perfil",
      settings: "Configuración",
      welcome: "Bienvenido",
      about: "Acerca de",
      products: "Productos",
      forTeams: "Para equipos",

      noUsers:
        "No se encontraron usuarios",
      filterByUser:
        "Filtrar por usuario",
      joined: "Se unió",

      questionsPage: "Preguntas",
      topQuestions:
        "Preguntas principales",
      newest: "Más recientes",
      active: "Activas",
      bountied: "Con recompensa",
      unanswered: "Sin respuesta",
      more: "Más",
      filter: "Filtrar",
      noQuestions:
        "No se encontraron preguntas",
      votes: "votos",
      answer: "respuesta",
      answers: "respuestas",
      asked: "preguntado",

      askPublicQuestion:
        "Hacer una pregunta pública",
      writingGoodQuestion:
        "Escribir una buena pregunta",
      title: "Título",
      titleDescription:
        "Sé específico e imagina que estás haciendo una pregunta a otra persona.",
      titlePlaceholder:
        "ej. ¿Cómo centrar un div en CSS?",
      problemDetails:
        "¿Cuáles son los detalles de tu problema?",
      problemDescription:
        "Introduce el problema y amplía lo que escribiste en el título. Mínimo 20 caracteres.",
      problemPlaceholder:
        "Describe tu problema en detalle...",
      tags: "Etiquetas",
      tagsDescription:
        "Añade hasta 5 etiquetas para describir de qué trata tu pregunta.",
      tagsPlaceholder:
        "ej. javascript react nextjs",
      reviewQuestion:
        "Revisar tu pregunta",

      noQuestion:
        "Pregunta no encontrada",
      loginToContinue:
        "Inicia sesión para continuar",
      voteUpdated:
        "Voto actualizado correctamente",
      failedToVote:
        "No se pudo actualizar el voto",
      answerUploaded:
        "Respuesta publicada correctamente",
      failedToAnswer:
        "No se pudo publicar la respuesta",
      confirmDeleteQuestion:
        "¿Seguro que quieres eliminar esta pregunta?",
      failedToDeleteQuestion:
        "No se pudo eliminar la pregunta",
      confirmDeleteAnswer:
        "¿Seguro que quieres eliminar esta respuesta?",
      deletedSuccessfully:
        "Eliminado correctamente",
      share: "Compartir",
      flag: "Reportar",
      delete: "Eliminar",
      answered: "respondido",
      yourAnswer: "Tu respuesta",
      writeAnswer:
        "Escribe tu respuesta aquí...",
      posting: "Publicando...",
      postYourAnswer:
        "Publicar tu respuesta",
      byPosting:
        "Al publicar tu respuesta, aceptas la",
      privacyPolicy:
        "política de privacidad",
      and: "y los",
      termsOfService:
        "términos de servicio",

      securityDeviceManagement:
        "Seguridad y gestión de dispositivos",
      securityDescription:
        "Administra tu historial de inicio de sesión, sesiones activas, verificación OTP y dispositivos de confianza.",
      loginHistory:
        "Historial de inicio de sesión",
      loginHistoryDescription:
        "Consulta tu actividad reciente de inicio de sesión.",
      viewHistory:
        "Ver historial",
      clickViewHistory:
        'Haz clic en "Ver historial" para cargar el historial.',
      successfulLogin:
        "Inicio de sesión exitoso",
      failedLogin:
        "Inicio de sesión fallido",
      ipAddress:
        "Dirección IP",
      device:
        "Dispositivo",
      unknown:
        "Desconocido",
      activeSessions:
        "Sesiones activas",
      activeSessionsDescription:
        "Administra los dispositivos que actualmente tienen tu cuenta iniciada.",
      viewSessions:
        "Ver sesiones",
      noActiveSessions:
        "No se encontraron sesiones activas.",
      activeDevice:
        "Dispositivo activo",
      ip: "IP",
      loginTime:
        "Inicio de sesión",
      unknownDevice:
        "Dispositivo desconocido",
      revoke:
        "Revocar",
      otpVerification:
        "Verificación OTP",
      otpVerificationDescription:
        "Genera y verifica una contraseña de un solo uso.",
      enterYourEmail:
        "Ingresa tu correo electrónico",
      generateOtp:
        "Generar OTP",
      enterOtp:
        "Ingresa el OTP",
      verifyOtp:
        "Verificar OTP",
      trustedDevices:
        "Dispositivos de confianza",
      trustedDevicesDescription:
        "Administra los dispositivos de confianza de tu cuenta.",
      viewDevices:
        "Ver dispositivos",
      deviceNamePlaceholder:
        "Nombre del dispositivo, ej. Mi laptop",
      trustThisDevice:
        "Confiar en este dispositivo",
      noTrustedDevices:
        "No se encontraron dispositivos de confianza.",
      trusted:
        "De confianza",
      remove:
        "Eliminar",
      loginHistoryLoaded:
        "Historial de inicio de sesión cargado",
      failedToLoadLoginHistory:
        "No se pudo cargar el historial de inicio de sesión",
      activeSessionsLoaded:
        "Sesiones activas cargadas",
      failedToLoadSessions:
        "No se pudieron cargar las sesiones",
      failedToRevokeSession:
        "No se pudo revocar la sesión",
      pleaseEnterEmail:
        "Ingresa tu correo electrónico",
      checkBackendTerminal:
        "Revisa la terminal del backend para obtener el OTP.",
      failedToGenerateOtp:
        "No se pudo generar el OTP",
      enterEmailAndOtp:
        "Ingresa el correo electrónico y el OTP",
      otpVerificationFailed:
        "La verificación del OTP falló",
      trustedDevicesLoaded:
        "Dispositivos de confianza cargados",
      failedToLoadTrustedDevices:
        "No se pudieron cargar los dispositivos de confianza",
      failedToAddTrustedDevice:
        "No se pudo agregar el dispositivo de confianza",
      failedToRemoveTrustedDevice:
        "No se pudo eliminar el dispositivo de confianza",

      noUserFound:
        "No se encontró ningún usuario.",
      editProfile:
        "Editar perfil",
      basicInformation:
        "Información básica",
      displayName:
        "Nombre para mostrar",
      yourDisplayName:
        "Tu nombre para mostrar",
      aboutMe:
        "Sobre mí",
      aboutPlaceholder:
        "Cuéntanos sobre ti, tu experiencia y tus intereses...",
      skillsAndTechnologies:
        "Habilidades y tecnologías",
      addSkill:
        "Añadir una habilidad o tecnología",
      cancel:
        "Cancelar",
      saveChanges:
        "Guardar cambios",
      memberSince:
        "Miembro desde",
      goldBadges:
        "insignias de oro",
      silverBadges:
        "insignias de plata",
      bronzeBadges:
        "insignias de bronce",
      topTags:
        "Etiquetas principales",
      profileUpdatedSuccessfully:
        "¡Perfil actualizado correctamente!",
      somethingWentWrong:
        "Algo salió mal",

      verifyYourDevice:
        "Verifica tu dispositivo",
      enterOtpSentTo:
        "Ingresa el OTP enviado a tu correo electrónico.",
      trustThisDeviceLogin:
        "Confiar en este dispositivo",
      verifying:
        "Verificando...",
      verifyDevice:
        "Verificar OTP",
      otpValidFiveMinutes:
        "El OTP es válido durante 5 minutos.",
      logInToYourAccount:
        "Inicia sesión en tu cuenta",
      enterEmailPassword:
        "Ingresa tu correo electrónico y contraseña para continuar.",
      logInWithGoogle:
        "Iniciar sesión con Google",
      logInWithGitHub:
        "Iniciar sesión con GitHub",
      orContinueWith:
        "O continúa con",
      password:
        "Contraseña",
      loading:
        "Cargando...",
      forgotYourPassword:
        "¿Olvidaste tu contraseña?",
      dontHaveAccount:
        "¿No tienes una cuenta?",
      allFieldsRequired:
        "Todos los campos son obligatorios",
      pleaseEnterOtp:
        "Ingresa el OTP",
      otpMustBeSixDigits:
        "El OTP debe tener 6 dígitos",

      forgotPassword:
        "¿Olvidaste tu contraseña?",
      forgotPasswordDescription:
        "Ingresa tu correo electrónico o número de teléfono registrado para recibir un OTP.",
      forgotEnterEmailPhone:
        "Ingresa tu correo electrónico o número de teléfono registrado.",
      otpSentSuccessfully:
        "OTP enviado correctamente.",
      failedToSendOtp:
        "No se pudo enviar el OTP.",
      passwordResetSuccessful:
        "Contraseña restablecida correctamente",
      passwordResetDescription:
        "Tu contraseña se ha restablecido correctamente.",
      yourNewPassword:
        "Tu nueva contraseña",
      savePassword:
        "Guarda esta contraseña de forma segura.",
      enterOtpDescription:
        "Ingresa el OTP enviado a tu contacto registrado.",
      phoneNumber:
        "Número de teléfono",
      registeredPhonePlaceholder:
        "Ingresa tu número de teléfono registrado",
      registeredEmailPlaceholder:
        "Ingresa tu correo electrónico registrado",
      otpPlaceholder:
        "Ingresa el OTP de 6 dígitos",
      otpValidity:
        "El OTP es válido durante 5 minutos.",
      changeEmail:
        "Cambiar correo electrónico",
      sending:
        "Enviando...",
      sendOtp:
        "Enviar OTP",
      rememberPassword:
        "¿Recuerdas tu contraseña?",
      invalidOtp:
        "OTP no válido",

      communityFeed:
        "Feed de la comunidad",
      trending:
        "Tendencias",
      notifications:
        "Notificaciones",
      searchHashtag:
        "Buscar hashtag...",
      clear:
        "Limpiar",
      resultsFor:
        "Resultados para",
      noNotifications:
        "No hay notificaciones",
      trendingPosts:
        "Publicaciones populares",
      noTrendingPosts:
        "No hay publicaciones populares",
      likes:
        "Me gusta",
      comments:
        "Comentarios",
      shares:
        "Compartidos",
      noPostsFound:
        "No se encontraron publicaciones",
      follow:
        "Seguir",
      saved:
        "Guardado",
      bookmark:
        "Guardar",
      edit:
        "Editar",
      report:
        "Reportar",
      reportReason:
        "¿Por qué estás denunciando esta publicación?",
      submitReport:
        "Enviar denuncia",
      writeComment:
        "Escribe un comentario...",
      comment:
        "Comentar",
      writeReply:
        "Escribe una respuesta...",
      reply:
        "Responder",
      loadingMorePosts:
        "Cargando más publicaciones...",
      noMorePosts:
        "No hay más publicaciones",
      confirmDeletePost:
        "¿Seguro que quieres eliminar esta publicación?",
      enterReportReason:
        "Por favor, introduce un motivo",
      postReportedSuccessfully:
        "Publicación denunciada correctamente",
      followStatusUpdated:
        "Estado de seguimiento actualizado",
      save:
        "Guardar",
    },
  },

  // =====================================================
  // HINDI
  // =====================================================

  hi: {
    translation: {
      home: "होम",
      questions: "प्रश्न",
      users: "यूज़र्स",
      login: "लॉग इन",
      signup: "साइन अप",
      askQuestion: "प्रश्न पूछें",
      search: "खोजें",
      language: "भाषा",
      logout: "लॉग आउट",
      profile: "प्रोफ़ाइल",
      settings: "सेटिंग्स",
      welcome: "स्वागत है",
      about: "के बारे में",
      products: "उत्पाद",
      forTeams: "टीमों के लिए",

      noUsers:
        "कोई यूज़र नहीं मिला",
      filterByUser:
        "यूज़र द्वारा फ़िल्टर करें",
      joined:
        "शामिल हुए",

      questionsPage: "प्रश्न",
      topQuestions:
        "शीर्ष प्रश्न",
      newest: "नवीनतम",
      active: "सक्रिय",
      bountied:
        "इनाम वाले",
      unanswered:
        "अनुत्तरित",
      more: "अधिक",
      filter: "फ़िल्टर",
      noQuestions:
        "कोई प्रश्न नहीं मिला",
      votes: "वोट",
      answer: "उत्तर",
      answers: "उत्तर",
      asked:
        "पूछा गया",

      askPublicQuestion:
        "सार्वजनिक प्रश्न पूछें",
      writingGoodQuestion:
        "एक अच्छा प्रश्न लिखना",
      title:
        "शीर्षक",
      titleDescription:
        "विशिष्ट रहें और कल्पना करें कि आप किसी दूसरे व्यक्ति से प्रश्न पूछ रहे हैं।",
      titlePlaceholder:
        "जैसे CSS में div को center कैसे करें?",
      problemDetails:
        "आपकी समस्या का विवरण क्या है?",
      problemDescription:
        "समस्या का परिचय दें और शीर्षक में लिखी बात को विस्तार से समझाएं। कम से कम 20 अक्षर।",
      problemPlaceholder:
        "अपनी समस्या का विस्तार से वर्णन करें...",
      tags:
        "टैग",
      tagsDescription:
        "अपने प्रश्न के बारे में बताने के लिए अधिकतम 5 टैग जोड़ें।",
      tagsPlaceholder:
        "जैसे javascript react nextjs",
      reviewQuestion:
        "अपने प्रश्न की समीक्षा करें",

      noQuestion:
        "प्रश्न नहीं मिला",
      loginToContinue:
        "जारी रखने के लिए कृपया लॉग इन करें",
      voteUpdated:
        "वोट सफलतापूर्वक अपडेट हुआ",
      failedToVote:
        "वोट अपडेट करने में विफल",
      answerUploaded:
        "उत्तर सफलतापूर्वक पोस्ट किया गया",
      failedToAnswer:
        "उत्तर पोस्ट करने में विफल",
      confirmDeleteQuestion:
        "क्या आप वाकई इस प्रश्न को हटाना चाहते हैं?",
      failedToDeleteQuestion:
        "प्रश्न हटाने में विफल",
      confirmDeleteAnswer:
        "क्या आप वाकई इस उत्तर को हटाना चाहते हैं?",
      deletedSuccessfully:
        "सफलतापूर्वक हटा दिया गया",
      share:
        "शेयर करें",
      flag:
        "रिपोर्ट करें",
      delete:
        "हटाएं",
      answered:
        "उत्तर दिया",
      yourAnswer:
        "आपका उत्तर",
      writeAnswer:
        "अपना उत्तर यहां लिखें...",
      posting:
        "पोस्ट किया जा रहा है...",
      postYourAnswer:
        "अपना उत्तर पोस्ट करें",
      byPosting:
        "अपना उत्तर पोस्ट करके, आप सहमत होते हैं",
      privacyPolicy:
        "गोपनीयता नीति",
      and:
        "और",
      termsOfService:
        "सेवा की शर्तों",

      securityDeviceManagement:
        "सुरक्षा और डिवाइस प्रबंधन",
      securityDescription:
        "अपने लॉगिन इतिहास, सक्रिय सत्र, OTP सत्यापन और विश्वसनीय डिवाइस प्रबंधित करें।",
      loginHistory:
        "लॉगिन इतिहास",
      loginHistoryDescription:
        "अपनी हाल की लॉगिन गतिविधि देखें।",
      viewHistory:
        "इतिहास देखें",
      clickViewHistory:
        'लॉगिन इतिहास लोड करने के लिए "इतिहास देखें" पर क्लिक करें।',
      successfulLogin:
        "सफल लॉगिन",
      failedLogin:
        "असफल लॉगिन",
      ipAddress:
        "IP पता",
      device:
        "डिवाइस",
      unknown:
        "अज्ञात",
      activeSessions:
        "सक्रिय सत्र",
      activeSessionsDescription:
        "वर्तमान में आपके खाते में लॉग इन डिवाइस प्रबंधित करें।",
      viewSessions:
        "सत्र देखें",
      noActiveSessions:
        "कोई सक्रिय सत्र नहीं मिला।",
      activeDevice:
        "सक्रिय डिवाइस",
      ip:
        "IP",
      loginTime:
        "लॉगिन",
      unknownDevice:
        "अज्ञात डिवाइस",
      revoke:
        "रद्द करें",
      otpVerification:
        "OTP सत्यापन",
      otpVerificationDescription:
        "एक बार उपयोग होने वाला पासवर्ड बनाएं और सत्यापित करें।",
      enterYourEmail:
        "अपना ईमेल दर्ज करें",
      generateOtp:
        "OTP बनाएं",
      enterOtp:
        "OTP दर्ज करें",
      verifyOtp:
        "OTP सत्यापित करें",
      trustedDevices:
        "विश्वसनीय डिवाइस",
      trustedDevicesDescription:
        "अपने खाते के विश्वसनीय डिवाइस प्रबंधित करें।",
      viewDevices:
        "डिवाइस देखें",
      deviceNamePlaceholder:
        "डिवाइस का नाम, जैसे My Laptop",
      trustThisDevice:
        "इस डिवाइस पर भरोसा करें",
      noTrustedDevices:
        "कोई विश्वसनीय डिवाइस नहीं मिला।",
      trusted:
        "विश्वसनीय",
      remove:
        "हटाएं",
      loginHistoryLoaded:
        "लॉगिन इतिहास लोड हो गया",
      failedToLoadLoginHistory:
        "लॉगिन इतिहास लोड करने में विफल",
      activeSessionsLoaded:
        "सक्रिय सत्र लोड हो गए",
      failedToLoadSessions:
        "सत्र लोड करने में विफल",
      failedToRevokeSession:
        "सत्र रद्द करने में विफल",
      pleaseEnterEmail:
        "कृपया अपना ईमेल दर्ज करें",
      checkBackendTerminal:
        "OTP के लिए अपने backend terminal को देखें।",
      failedToGenerateOtp:
        "OTP बनाने में विफल",
      enterEmailAndOtp:
        "ईमेल और OTP दर्ज करें",
      otpVerificationFailed:
        "OTP सत्यापन विफल",
      trustedDevicesLoaded:
        "विश्वसनीय डिवाइस लोड हो गए",
      failedToLoadTrustedDevices:
        "विश्वसनीय डिवाइस लोड करने में विफल",
      failedToAddTrustedDevice:
        "विश्वसनीय डिवाइस जोड़ने में विफल",
      failedToRemoveTrustedDevice:
        "विश्वसनीय डिवाइस हटाने में विफल",

      noUserFound:
        "कोई यूज़र नहीं मिला।",
      editProfile:
        "प्रोफ़ाइल संपादित करें",
      basicInformation:
        "मूल जानकारी",
      displayName:
        "प्रदर्शन नाम",
      yourDisplayName:
        "अपना प्रदर्शन नाम",
      aboutMe:
        "मेरे बारे में",
      aboutPlaceholder:
        "अपने बारे में, अपने अनुभव और रुचियों के बारे में बताएं...",
      skillsAndTechnologies:
        "कौशल और तकनीक",
      addSkill:
        "कोई कौशल या तकनीक जोड़ें",
      cancel:
        "रद्द करें",
      saveChanges:
        "बदलाव सेव करें",
      memberSince:
        "सदस्य बने",
      goldBadges:
        "गोल्ड बैज",
      silverBadges:
        "सिल्वर बैज",
      bronzeBadges:
        "ब्रॉन्ज़ बैज",
      topTags:
        "मुख्य टैग",
      profileUpdatedSuccessfully:
        "प्रोफ़ाइल सफलतापूर्वक अपडेट हो गई!",
      somethingWentWrong:
        "कुछ गलत हो गया",

      verifyYourDevice:
        "अपने डिवाइस को सत्यापित करें",
      enterOtpSentTo:
        "अपने ईमेल पर भेजा गया OTP दर्ज करें।",
      trustThisDeviceLogin:
        "इस डिवाइस पर भरोसा करें",
      verifying:
        "सत्यापित किया जा रहा है...",
      verifyDevice:
        "OTP सत्यापित करें",
      otpValidFiveMinutes:
        "OTP 5 मिनट के लिए मान्य है।",
      logInToYourAccount:
        "अपने खाते में लॉग इन करें",
      enterEmailPassword:
        "जारी रखने के लिए अपना ईमेल और पासवर्ड दर्ज करें।",
      logInWithGoogle:
        "Google से लॉग इन करें",
      logInWithGitHub:
        "GitHub से लॉग इन करें",
      orContinueWith:
        "या इसके साथ जारी रखें",
      password:
        "पासवर्ड",
      loading:
        "लोड हो रहा है...",
      forgotYourPassword:
        "अपना पासवर्ड भूल गए?",
      dontHaveAccount:
        "खाता नहीं है?",
      allFieldsRequired:
        "सभी फ़ील्ड आवश्यक हैं",
      pleaseEnterOtp:
        "कृपया OTP दर्ज करें",
      otpMustBeSixDigits:
        "OTP 6 अंकों का होना चाहिए",

      forgotPassword:
        "पासवर्ड भूल गए?",
      forgotPasswordDescription:
        "OTP प्राप्त करने के लिए अपना पंजीकृत ईमेल या मोबाइल नंबर दर्ज करें।",
      forgotEnterEmailPhone:
        "कृपया अपना पंजीकृत ईमेल या मोबाइल नंबर दर्ज करें।",
      otpSentSuccessfully:
        "OTP सफलतापूर्वक भेज दिया गया।",
      failedToSendOtp:
        "OTP भेजने में विफल।",
      passwordResetSuccessful:
        "पासवर्ड सफलतापूर्वक रीसेट हो गया",
      passwordResetDescription:
        "आपका पासवर्ड सफलतापूर्वक रीसेट हो गया है।",
      yourNewPassword:
        "आपका नया पासवर्ड",
      savePassword:
        "इस पासवर्ड को सुरक्षित रूप से सेव करें।",
      enterOtpDescription:
        "अपने पंजीकृत संपर्क पर भेजा गया OTP दर्ज करें।",
      phoneNumber:
        "मोबाइल नंबर",
      registeredPhonePlaceholder:
        "अपना पंजीकृत मोबाइल नंबर दर्ज करें",
      registeredEmailPlaceholder:
        "अपना पंजीकृत ईमेल दर्ज करें",
      otpPlaceholder:
        "6 अंकों का OTP दर्ज करें",
      otpValidity:
        "OTP 5 मिनट के लिए मान्य है।",
      changeEmail:
        "ईमेल बदलें",
      sending:
        "भेजा जा रहा है...",
      sendOtp:
        "OTP भेजें",
      rememberPassword:
        "अपना पासवर्ड याद है?",
      invalidOtp:
        "अमान्य OTP",

      communityFeed:
        "कम्युनिटी फ़ीड",
      trending:
        "ट्रेंडिंग",
      notifications:
        "सूचनाएं",
      searchHashtag:
        "हैशटैग खोजें...",
      clear:
        "साफ़ करें",
      resultsFor:
        "इसके परिणाम",
      noNotifications:
        "कोई सूचना नहीं",
      trendingPosts:
        "ट्रेंडिंग पोस्ट",
      noTrendingPosts:
        "कोई ट्रेंडिंग पोस्ट नहीं",
      likes:
        "लाइक्स",
      comments:
        "टिप्पणियां",
      shares:
        "शेयर",
      noPostsFound:
        "कोई पोस्ट नहीं मिली",
      follow:
        "फ़ॉलो करें",
      saved:
        "सेव किया गया",
      bookmark:
        "बुकमार्क",
      edit:
        "संपादित करें",
      report:
        "रिपोर्ट करें",
      reportReason:
        "आप इस पोस्ट की रिपोर्ट क्यों कर रहे हैं?",
      submitReport:
        "रिपोर्ट भेजें",
      writeComment:
        "एक टिप्पणी लिखें...",
      comment:
        "टिप्पणी",
      writeReply:
        "एक उत्तर लिखें...",
      reply:
        "उत्तर दें",
      loadingMorePosts:
        "और पोस्ट लोड हो रही हैं...",
      noMorePosts:
        "और कोई पोस्ट नहीं",
      confirmDeletePost:
        "क्या आप वाकई इस पोस्ट को हटाना चाहते हैं?",
      enterReportReason:
        "कृपया कारण दर्ज करें",
      postReportedSuccessfully:
        "पोस्ट सफलतापूर्वक रिपोर्ट की गई",
      followStatusUpdated:
        "फ़ॉलो स्थिति अपडेट हो गई",
      save:
        "सेव करें",
    },
  },

  // =====================================================
  // PORTUGUESE
  // =====================================================

  pt: {
    translation: {
      home: "Início",
      questions: "Perguntas",
      users: "Usuários",
      login: "Entrar",
      signup: "Cadastrar",
      askQuestion: "Fazer pergunta",
      search: "Pesquisar",
      language: "Idioma",
      logout: "Sair",
      profile: "Perfil",
      settings: "Configurações",
      welcome: "Bem-vindo",
      about: "Sobre",
      products: "Produtos",
      forTeams: "Para equipes",

      noUsers:
        "Nenhum usuário encontrado",
      filterByUser:
        "Filtrar por usuário",
      joined:
        "Entrou em",

      questionsPage:
        "Perguntas",
      topQuestions:
        "Principais perguntas",
      newest:
        "Mais recentes",
      active:
        "Ativas",
      bountied:
        "Com recompensa",
      unanswered:
        "Sem resposta",
      more:
        "Mais",
      filter:
        "Filtrar",
      noQuestions:
        "Nenhuma pergunta encontrada",
      votes:
        "votos",
      answer:
        "resposta",
      answers:
        "respostas",
      asked:
        "perguntado",

      askPublicQuestion:
        "Fazer uma pergunta pública",
      writingGoodQuestion:
        "Escrevendo uma boa pergunta",
      title:
        "Título",
      titleDescription:
        "Seja específico e imagine que está fazendo uma pergunta a outra pessoa.",
      titlePlaceholder:
        "ex. Como centralizar uma div em CSS?",
      problemDetails:
        "Quais são os detalhes de seu problema?",
      problemDescription:
        "Apresente o problema e explique melhor o que colocou no título. Mínimo de 20 caracteres.",
      problemPlaceholder:
        "Descreva seu problema em detalhes...",
      tags:
        "Tags",
      tagsDescription:
        "Adicione até 5 tags para descrever sobre o que é sua pergunta.",
      tagsPlaceholder:
        "ex. javascript react nextjs",
      reviewQuestion:
        "Revisar sua pergunta",

      noQuestion:
        "Pergunta não encontrada",
      loginToContinue:
        "Faça login para continuar",
      voteUpdated:
        "Voto atualizado com sucesso",
      failedToVote:
        "Falha ao atualizar o voto",
      answerUploaded:
        "Resposta publicada com sucesso",
      failedToAnswer:
        "Falha ao publicar a resposta",
      confirmDeleteQuestion:
        "Tem certeza de que deseja excluir esta pergunta?",
      failedToDeleteQuestion:
        "Falha ao excluir a pergunta",
      confirmDeleteAnswer:
        "Tem certeza de que deseja excluir esta resposta?",
      deletedSuccessfully:
        "Excluído com sucesso",
      share:
        "Compartilhar",
      flag:
        "Denunciar",
      delete:
        "Excluir",
      answered:
        "respondido",
      yourAnswer:
        "Sua resposta",
      writeAnswer:
        "Escreva sua resposta aqui...",
      posting:
        "Publicando...",
      postYourAnswer:
        "Publicar sua resposta",
      byPosting:
        "Ao publicar sua resposta, você concorda com a",
      privacyPolicy:
        "política de privacidade",
      and:
        "e os",
      termsOfService:
        "termos de serviço",

      securityDeviceManagement:
        "Segurança e gerenciamento de dispositivos",
      securityDescription:
        "Gerencie seu histórico de login, sessões ativas, verificação OTP e dispositivos confiáveis.",
      loginHistory:
        "Histórico de login",
      loginHistoryDescription:
        "Veja sua atividade recente de login.",
      viewHistory:
        "Ver histórico",
      clickViewHistory:
        'Clique em "Ver histórico" para carregar o histórico.',
      successfulLogin:
        "Login realizado com sucesso",
      failedLogin:
        "Falha no login",
      ipAddress:
        "Endereço IP",
      device:
        "Dispositivo",
      unknown:
        "Desconhecido",
      activeSessions:
        "Sessões ativas",
      activeSessionsDescription:
        "Gerencie os dispositivos atualmente conectados à sua conta.",
      viewSessions:
        "Ver sessões",
      noActiveSessions:
        "Nenhuma sessão ativa encontrada.",
      activeDevice:
        "Dispositivo ativo",
      ip:
        "IP",
      loginTime:
        "Login",
      unknownDevice:
        "Dispositivo desconhecido",
      revoke:
        "Revogar",
      otpVerification:
        "Verificação OTP",
      otpVerificationDescription:
        "Gere e verifique uma senha de uso único.",
      enterYourEmail:
        "Digite seu e-mail",
      generateOtp:
        "Gerar OTP",
      enterOtp:
        "Digite o OTP",
      verifyOtp:
        "Verificar OTP",
      trustedDevices:
        "Dispositivos confiáveis",
      trustedDevicesDescription:
        "Gerencie os dispositivos confiáveis da sua conta.",
      viewDevices:
        "Ver dispositivos",
      deviceNamePlaceholder:
        "Nome do dispositivo, ex. Meu Laptop",
      trustThisDevice:
        "Confiar neste dispositivo",
      noTrustedDevices:
        "Nenhum dispositivo confiável encontrado.",
      trusted:
        "Confiável",
      remove:
        "Remover",
      loginHistoryLoaded:
        "Histórico de login carregado",
      failedToLoadLoginHistory:
        "Falha ao carregar o histórico de login",
      activeSessionsLoaded:
        "Sessões ativas carregadas",
      failedToLoadSessions:
        "Falha ao carregar as sessões",
      failedToRevokeSession:
        "Falha ao revogar a sessão",
      pleaseEnterEmail:
        "Digite seu e-mail",
      checkBackendTerminal:
        "Verifique o terminal do backend para obter o OTP.",
      failedToGenerateOtp:
        "Falha ao gerar o OTP",
      enterEmailAndOtp:
        "Digite o e-mail e o OTP",
      otpVerificationFailed:
        "Falha na verificação do OTP",
      trustedDevicesLoaded:
        "Dispositivos confiáveis carregados",
      failedToLoadTrustedDevices:
        "Falha ao carregar dispositivos confiáveis",
      failedToAddTrustedDevice:
        "Falha ao adicionar dispositivo confiável",
      failedToRemoveTrustedDevice:
        "Falha ao remover dispositivo confiável",

      noUserFound:
        "Nenhum usuário encontrado.",
      editProfile:
        "Editar perfil",
      basicInformation:
        "Informações básicas",
      displayName:
        "Nome de exibição",
      yourDisplayName:
        "Seu nome de exibição",
      aboutMe:
        "Sobre mim",
      aboutPlaceholder:
        "Conte-nos sobre você, sua experiência e seus interesses...",
      skillsAndTechnologies:
        "Habilidades e tecnologias",
      addSkill:
        "Adicionar uma habilidade ou tecnologia",
      cancel:
        "Cancelar",
      saveChanges:
        "Salvar alterações",
      memberSince:
        "Membro desde",
      goldBadges:
        "insígnias de ouro",
      silverBadges:
        "insígnias de prata",
      bronzeBadges:
        "insígnias de bronze",
      topTags:
        "Principais tags",
      profileUpdatedSuccessfully:
        "Perfil atualizado com sucesso!",
      somethingWentWrong:
        "Algo deu errado",

      verifyYourDevice:
        "Verifique seu dispositivo",
      enterOtpSentTo:
        "Digite o OTP enviado para seu e-mail.",
      trustThisDeviceLogin:
        "Confiar neste dispositivo",
      verifying:
        "Verificando...",
      verifyDevice:
        "Verificar OTP",
      otpValidFiveMinutes:
        "O OTP é válido por 5 minutos.",
      logInToYourAccount:
        "Entre na sua conta",
      enterEmailPassword:
        "Digite seu e-mail e senha para continuar.",
      logInWithGoogle:
        "Entrar com Google",
      logInWithGitHub:
        "Entrar com GitHub",
      orContinueWith:
        "Ou continue com",
      password:
        "Senha",
      loading:
        "Carregando...",
      forgotYourPassword:
        "Esqueceu sua senha?",
      dontHaveAccount:
        "Não tem uma conta?",
      allFieldsRequired:
        "Todos os campos são obrigatórios",
      pleaseEnterOtp:
        "Digite o OTP",
      otpMustBeSixDigits:
        "O OTP deve ter 6 dígitos",

      forgotPassword:
        "Esqueceu a senha?",
      forgotPasswordDescription:
        "Digite seu e-mail ou número de telefone registrado para receber um OTP.",
      forgotEnterEmailPhone:
        "Digite seu e-mail ou número de telefone registrado.",
      otpSentSuccessfully:
        "OTP enviado com sucesso.",
      failedToSendOtp:
        "Falha ao enviar o OTP.",
      passwordResetSuccessful:
        "Senha redefinida com sucesso",
      passwordResetDescription:
        "Sua senha foi redefinida com sucesso.",
      yourNewPassword:
        "Sua nova senha",
      savePassword:
        "Salve esta senha com segurança.",
      enterOtpDescription:
        "Digite o OTP enviado para seu contato registrado.",
      phoneNumber:
        "Número de telefone",
      registeredPhonePlaceholder:
        "Digite seu número de telefone registrado",
      registeredEmailPlaceholder:
        "Digite seu e-mail registrado",
      otpPlaceholder:
        "Digite o OTP de 6 dígitos",
      otpValidity:
        "O OTP é válido por 5 minutos.",
      changeEmail:
        "Alterar e-mail",
      sending:
        "Enviando...",
      sendOtp:
        "Enviar OTP",
      rememberPassword:
        "Lembra da sua senha?",
      invalidOtp:
        "OTP inválido",

      communityFeed:
        "Feed da comunidade",
      trending:
        "Em alta",
      notifications:
        "Notificações",
      searchHashtag:
        "Pesquisar hashtag...",
      clear:
        "Limpar",
      resultsFor:
        "Resultados para",
      noNotifications:
        "Nenhuma notificação",
      trendingPosts:
        "Publicações em alta",
      noTrendingPosts:
        "Nenhuma publicação em alta",
      likes:
        "Curtidas",
      comments:
        "Comentários",
      shares:
        "Compartilhamentos",
      noPostsFound:
        "Nenhuma publicação encontrada",
      follow:
        "Seguir",
      saved:
        "Salvo",
      bookmark:
        "Favoritar",
      edit:
        "Editar",
      report:
        "Denunciar",
      reportReason:
        "Por que você está denunciando esta publicação?",
      submitReport:
        "Enviar denúncia",
      writeComment:
        "Escreva um comentário...",
      comment:
        "Comentar",
      writeReply:
        "Escreva uma resposta...",
      reply:
        "Responder",
      loadingMorePosts:
        "Carregando mais publicações...",
      noMorePosts:
        "Não há mais publicações",
      confirmDeletePost:
        "Tem certeza de que deseja excluir esta publicação?",
      enterReportReason:
        "Digite um motivo",
      postReportedSuccessfully:
        "Publicação denunciada com sucesso",
      followStatusUpdated:
        "Status de seguir atualizado",
      save:
        "Salvar",
    },
  },

  // =====================================================
  // CHINESE
  // =====================================================

  zh: {
    translation: {
      home: "首页",
      questions: "问题",
      users: "用户",
      login: "登录",
      signup: "注册",
      askQuestion: "提问",
      search: "搜索",
      language: "语言",
      logout: "退出登录",
      profile: "个人资料",
      settings: "设置",
      welcome: "欢迎",
      about: "关于",
      products: "产品",
      forTeams: "团队",

      noUsers:
        "未找到用户",
      filterByUser:
        "按用户筛选",
      joined:
        "加入于",

      questionsPage:
        "问题",
      topQuestions:
        "热门问题",
      newest:
        "最新",
      active:
        "活跃",
      bountied:
        "悬赏",
      unanswered:
        "未回答",
      more:
        "更多",
      filter:
        "筛选",
      noQuestions:
        "未找到问题",
      votes:
        "票",
      answer:
        "回答",
      answers:
        "回答",
      asked:
        "提问于",

      askPublicQuestion:
        "提出公开问题",
      writingGoodQuestion:
        "撰写一个好的问题",
      title:
        "标题",
      titleDescription:
        "请具体描述，并想象你正在向其他人提出问题。",
      titlePlaceholder:
        "例如：如何在 CSS 中居中 div？",
      problemDetails:
        "你的问题有哪些详细信息？",
      problemDescription:
        "介绍问题，并详细说明标题中的内容。至少 20 个字符。",
      problemPlaceholder:
        "详细描述你的问题...",
      tags:
        "标签",
      tagsDescription:
        "添加最多 5 个标签来描述你的问题。",
      tagsPlaceholder:
        "例如：javascript react nextjs",
      reviewQuestion:
        "检查你的问题",

      noQuestion:
        "未找到问题",
      loginToContinue:
        "请登录后继续",
      voteUpdated:
        "投票更新成功",
      failedToVote:
        "更新投票失败",
      answerUploaded:
        "回答发布成功",
      failedToAnswer:
        "发布回答失败",
      confirmDeleteQuestion:
        "确定要删除这个问题吗？",
      failedToDeleteQuestion:
        "删除问题失败",
      confirmDeleteAnswer:
        "确定要删除这个回答吗？",
      deletedSuccessfully:
        "删除成功",
      share:
        "分享",
      flag:
        "举报",
      delete:
        "删除",
      answered:
        "已回答",
      yourAnswer:
        "你的回答",
      writeAnswer:
        "在这里写下你的回答...",
      posting:
        "发布中...",
      postYourAnswer:
        "发布你的回答",
      byPosting:
        "发布回答即表示你同意",
      privacyPolicy:
        "隐私政策",
      and:
        "和",
      termsOfService:
        "服务条款",

      securityDeviceManagement:
        "安全与设备管理",
      securityDescription:
        "管理您的登录历史记录、活动会话、OTP 验证和受信任设备。",
      loginHistory:
        "登录历史",
      loginHistoryDescription:
        "查看您最近的登录活动。",
      viewHistory:
        "查看历史",
      clickViewHistory:
        '点击“查看历史”以加载登录历史。',
      successfulLogin:
        "登录成功",
      failedLogin:
        "登录失败",
      ipAddress:
        "IP 地址",
      device:
        "设备",
      unknown:
        "未知",
      activeSessions:
        "活动会话",
      activeSessionsDescription:
        "管理当前登录您账户的设备。",
      viewSessions:
        "查看会话",
      noActiveSessions:
        "未找到活动会话。",
      activeDevice:
        "活动设备",
      ip:
        "IP",
      loginTime:
        "登录",
      unknownDevice:
        "未知设备",
      revoke:
        "撤销",
      otpVerification:
        "OTP 验证",
      otpVerificationDescription:
        "生成并验证一次性密码。",
      enterYourEmail:
        "输入您的电子邮件",
      generateOtp:
        "生成 OTP",
      enterOtp:
        "输入 OTP",
      verifyOtp:
        "验证 OTP",
      trustedDevices:
        "受信任设备",
      trustedDevicesDescription:
        "管理您账户的受信任设备。",
      viewDevices:
        "查看设备",
      deviceNamePlaceholder:
        "设备名称，例如 我的笔记本电脑",
      trustThisDevice:
        "信任此设备",
      noTrustedDevices:
        "未找到受信任设备。",
      trusted:
        "受信任",
      remove:
        "移除",
      loginHistoryLoaded:
        "登录历史已加载",
      failedToLoadLoginHistory:
        "加载登录历史失败",
      activeSessionsLoaded:
        "活动会话已加载",
      failedToLoadSessions:
        "加载会话失败",
      failedToRevokeSession:
        "撤销会话失败",
      pleaseEnterEmail:
        "请输入您的电子邮件",
      checkBackendTerminal:
        "请查看 backend terminal 获取 OTP。",
      failedToGenerateOtp:
        "生成 OTP 失败",
      enterEmailAndOtp:
        "请输入电子邮件和 OTP",
      otpVerificationFailed:
        "OTP 验证失败",
      trustedDevicesLoaded:
        "受信任设备已加载",
      failedToLoadTrustedDevices:
        "加载受信任设备失败",
      failedToAddTrustedDevice:
        "添加受信任设备失败",
      failedToRemoveTrustedDevice:
        "移除受信任设备失败",

      noUserFound:
        "未找到用户。",
      editProfile:
        "编辑个人资料",
      basicInformation:
        "基本信息",
      displayName:
        "显示名称",
      yourDisplayName:
        "您的显示名称",
      aboutMe:
        "关于我",
      aboutPlaceholder:
        "介绍一下您自己、您的经验和兴趣...",
      skillsAndTechnologies:
        "技能和技术",
      addSkill:
        "添加技能或技术",
      cancel:
        "取消",
      saveChanges:
        "保存更改",
      memberSince:
        "成员自",
      goldBadges:
        "金徽章",
      silverBadges:
        "银徽章",
      bronzeBadges:
        "铜徽章",
      topTags:
        "热门标签",
      profileUpdatedSuccessfully:
        "个人资料更新成功！",
      somethingWentWrong:
        "出了点问题",

      verifyYourDevice:
        "验证您的设备",
      enterOtpSentTo:
        "输入发送到您电子邮件的 OTP。",
      trustThisDeviceLogin:
        "信任此设备",
      verifying:
        "正在验证...",
      verifyDevice:
        "验证 OTP",
      otpValidFiveMinutes:
        "OTP 有效期为 5 分钟。",
      logInToYourAccount:
        "登录您的账户",
      enterEmailPassword:
        "输入您的电子邮件和密码以继续。",
      logInWithGoogle:
        "使用 Google 登录",
      logInWithGitHub:
        "使用 GitHub 登录",
      orContinueWith:
        "或继续使用",
      password:
        "密码",
      loading:
        "正在加载...",
      forgotYourPassword:
        "忘记密码？",
      dontHaveAccount:
        "还没有账户？",
      allFieldsRequired:
        "所有字段都是必填项",
      pleaseEnterOtp:
        "请输入 OTP",
      otpMustBeSixDigits:
        "OTP 必须是 6 位数字",

      forgotPassword:
        "忘记密码？",
      forgotPasswordDescription:
        "请输入您注册的电子邮件或手机号码以接收 OTP。",
      forgotEnterEmailPhone:
        "请输入您注册的电子邮件或手机号码。",
      otpSentSuccessfully:
        "OTP 发送成功。",
      failedToSendOtp:
        "OTP 发送失败。",
      passwordResetSuccessful:
        "密码重置成功",
      passwordResetDescription:
        "您的密码已成功重置。",
      yourNewPassword:
        "您的新密码",
      savePassword:
        "请安全保存此密码。",
      enterOtpDescription:
        "请输入发送到您注册联系方式的 OTP。",
      phoneNumber:
        "手机号码",
      registeredPhonePlaceholder:
        "输入您注册的手机号码",
      registeredEmailPlaceholder:
        "输入您注册的电子邮件",
      otpPlaceholder:
        "输入 6 位 OTP",
      otpValidity:
        "OTP 有效期为 5 分钟。",
      changeEmail:
        "更改电子邮件",
      sending:
        "正在发送...",
      sendOtp:
        "发送 OTP",
      rememberPassword:
        "记得您的密码吗？",
      invalidOtp:
        "OTP 无效",

      communityFeed:
        "社区动态",
      trending:
        "热门",
      notifications:
        "通知",
      searchHashtag:
        "搜索标签...",
      clear:
        "清除",
      resultsFor:
        "结果",
      noNotifications:
        "没有通知",
      trendingPosts:
        "热门帖子",
      noTrendingPosts:
        "没有热门帖子",
      likes:
        "点赞",
      comments:
        "评论",
      shares:
        "分享",
      noPostsFound:
        "未找到帖子",
      follow:
        "关注",
      saved:
        "已保存",
      bookmark:
        "收藏",
      edit:
        "编辑",
      report:
        "举报",
      reportReason:
        "为什么要举报这篇帖子？",
      submitReport:
        "提交举报",
      writeComment:
        "写评论...",
      comment:
        "评论",
      writeReply:
        "写回复...",
      reply:
        "回复",
      loadingMorePosts:
        "正在加载更多帖子...",
      noMorePosts:
        "没有更多帖子",
      confirmDeletePost:
        "确定要删除这篇帖子吗？",
      enterReportReason:
        "请输入原因",
      postReportedSuccessfully:
        "帖子举报成功",
      followStatusUpdated:
        "关注状态已更新",
      save:
        "保存",
    },
  },

  // =====================================================
  // FRENCH
  // =====================================================

  fr: {
    translation: {
      home: "Accueil",
      questions: "Questions",
      users: "Utilisateurs",
      login: "Se connecter",
      signup: "S'inscrire",
      askQuestion:
        "Poser une question",
      search:
        "Rechercher",
      language:
        "Langue",
      logout:
        "Se déconnecter",
      profile:
        "Profil",
      settings:
        "Paramètres",
      welcome:
        "Bienvenue",
      about:
        "À propos",
      products:
        "Produits",
      forTeams:
        "Pour les équipes",

      noUsers:
        "Aucun utilisateur trouvé",
      filterByUser:
        "Filtrer par utilisateur",
      joined:
        "Inscrit en",

      questionsPage:
        "Questions",
      topQuestions:
        "Questions principales",
      newest:
        "Plus récentes",
      active:
        "Actives",
      bountied:
        "Avec récompense",
      unanswered:
        "Sans réponse",
      more:
        "Plus",
      filter:
        "Filtrer",
      noQuestions:
        "Aucune question trouvée",
      votes:
        "votes",
      answer:
        "réponse",
      answers:
        "réponses",
      asked:
        "demandé",

      askPublicQuestion:
        "Poser une question publique",
      writingGoodQuestion:
        "Rédiger une bonne question",
      title:
        "Titre",
      titleDescription:
        "Soyez précis et imaginez que vous posez une question à une autre personne.",
      titlePlaceholder:
        "ex. Comment centrer une div en CSS ?",
      problemDetails:
        "Quels sont les détails de votre problème ?",
      problemDescription:
        "Présentez le problème et développez ce que vous avez indiqué dans le titre. Minimum 20 caractères.",
      problemPlaceholder:
        "Décrivez votre problème en détail...",
      tags:
        "Balises",
      tagsDescription:
        "Ajoutez jusqu'à 5 balises pour décrire le sujet de votre question.",
      tagsPlaceholder:
        "ex. javascript react nextjs",
      reviewQuestion:
        "Vérifier votre question",

      noQuestion:
        "Question introuvable",
      loginToContinue:
        "Veuillez vous connecter pour continuer",
      voteUpdated:
        "Vote mis à jour avec succès",
      failedToVote:
        "Échec de la mise à jour du vote",
      answerUploaded:
        "Réponse publiée avec succès",
      failedToAnswer:
        "Échec de la publication de la réponse",
      confirmDeleteQuestion:
        "Êtes-vous sûr de vouloir supprimer cette question ?",
      failedToDeleteQuestion:
        "Échec de la suppression de la question",
      confirmDeleteAnswer:
        "Êtes-vous sûr de vouloir supprimer cette réponse ?",
      deletedSuccessfully:
        "Supprimé avec succès",
      share:
        "Partager",
      flag:
        "Signaler",
      delete:
        "Supprimer",
      answered:
        "répondu",
      yourAnswer:
        "Votre réponse",
      writeAnswer:
        "Écrivez votre réponse ici...",
      posting:
        "Publication...",
      postYourAnswer:
        "Publier votre réponse",
      byPosting:
        "En publiant votre réponse, vous acceptez la",
      privacyPolicy:
        "politique de confidentialité",
      and:
        "et les",
      termsOfService:
        "conditions d'utilisation",

      securityDeviceManagement:
        "Sécurité et gestion des appareils",
      securityDescription:
        "Gérez votre historique de connexion, vos sessions actives, la vérification OTP et vos appareils de confiance.",
      loginHistory:
        "Historique des connexions",
      loginHistoryDescription:
        "Consultez votre activité récente de connexion.",
      viewHistory:
        "Voir l'historique",
      clickViewHistory:
        'Cliquez sur « Voir l’historique » pour charger l’historique.',
      successfulLogin:
        "Connexion réussie",
      failedLogin:
        "Échec de la connexion",
      ipAddress:
        "Adresse IP",
      device:
        "Appareil",
      unknown:
        "Inconnu",
      activeSessions:
        "Sessions actives",
      activeSessionsDescription:
        "Gérez les appareils actuellement connectés à votre compte.",
      viewSessions:
        "Voir les sessions",
      noActiveSessions:
        "Aucune session active trouvée.",
      activeDevice:
        "Appareil actif",
      ip:
        "IP",
      loginTime:
        "Connexion",
      unknownDevice:
        "Appareil inconnu",
      revoke:
        "Révoquer",
      otpVerification:
        "Vérification OTP",
      otpVerificationDescription:
        "Générez et vérifiez un mot de passe à usage unique.",
      enterYourEmail:
        "Entrez votre e-mail",
      generateOtp:
        "Générer un OTP",
      enterOtp:
        "Entrez l'OTP",
      verifyOtp:
        "Vérifier l'OTP",
      trustedDevices:
        "Appareils de confiance",
      trustedDevicesDescription:
        "Gérez les appareils de confiance de votre compte.",
      viewDevices:
        "Voir les appareils",
      deviceNamePlaceholder:
        "Nom de l'appareil, ex. Mon ordinateur",
      trustThisDevice:
        "Faire confiance à cet appareil",
      noTrustedDevices:
        "Aucun appareil de confiance trouvé.",
      trusted:
        "De confiance",
      remove:
        "Supprimer",
      loginHistoryLoaded:
        "Historique des connexions chargé",
      failedToLoadLoginHistory:
        "Échec du chargement de l'historique des connexions",
      activeSessionsLoaded:
        "Sessions actives chargées",
      failedToLoadSessions:
        "Échec du chargement des sessions",
      failedToRevokeSession:
        "Échec de la révocation de la session",
      pleaseEnterEmail:
        "Veuillez saisir votre e-mail",
      checkBackendTerminal:
        "Consultez le terminal backend pour obtenir l'OTP.",
      failedToGenerateOtp:
        "Échec de la génération de l'OTP",
      enterEmailAndOtp:
        "Entrez l'e-mail et l'OTP",
      otpVerificationFailed:
        "Échec de la vérification de l'OTP",
      trustedDevicesLoaded:
        "Appareils de confiance chargés",
      failedToLoadTrustedDevices:
        "Échec du chargement des appareils de confiance",
      failedToAddTrustedDevice:
        "Échec de l'ajout de l'appareil de confiance",
      failedToRemoveTrustedDevice:
        "Échec de la suppression de l'appareil de confiance",

      noUserFound:
        "Aucun utilisateur trouvé.",
      editProfile:
        "Modifier le profil",
      basicInformation:
        "Informations de base",
      displayName:
        "Nom d'affichage",
      yourDisplayName:
        "Votre nom d'affichage",
      aboutMe:
        "À propos de moi",
      aboutPlaceholder:
        "Parlez-nous de vous, de votre expérience et de vos centres d'intérêt...",
      skillsAndTechnologies:
        "Compétences et technologies",
      addSkill:
        "Ajouter une compétence ou une technologie",
      cancel:
        "Annuler",
      saveChanges:
        "Enregistrer les modifications",
      memberSince:
        "Membre depuis",
      goldBadges:
        "badges or",
      silverBadges:
        "badges argent",
      bronzeBadges:
        "badges bronze",
      topTags:
        "Tags principaux",
      profileUpdatedSuccessfully:
        "Profil mis à jour avec succès !",
      somethingWentWrong:
        "Une erreur s'est produite",

      verifyYourDevice:
        "Vérifiez votre appareil",
      enterOtpSentTo:
        "Entrez l'OTP envoyé à votre e-mail.",
      trustThisDeviceLogin:
        "Faire confiance à cet appareil",
      verifying:
        "Vérification...",
      verifyDevice:
        "Vérifier l'OTP",
      otpValidFiveMinutes:
        "L'OTP est valide pendant 5 minutes.",
      logInToYourAccount:
        "Connectez-vous à votre compte",
      enterEmailPassword:
        "Entrez votre e-mail et votre mot de passe pour continuer.",
      logInWithGoogle:
        "Se connecter avec Google",
      logInWithGitHub:
        "Se connecter avec GitHub",
      orContinueWith:
        "Ou continuer avec",
      password:
        "Mot de passe",
      loading:
        "Chargement...",
      forgotYourPassword:
        "Mot de passe oublié ?",
      dontHaveAccount:
        "Vous n'avez pas de compte ?",
      allFieldsRequired:
        "Tous les champs sont obligatoires",
      pleaseEnterOtp:
        "Veuillez saisir l'OTP",
      otpMustBeSixDigits:
        "L'OTP doit comporter 6 chiffres",

      forgotPassword:
        "Mot de passe oublié ?",
      forgotPasswordDescription:
        "Entrez votre adresse e-mail ou votre numéro de téléphone enregistré pour recevoir un OTP.",
      forgotEnterEmailPhone:
        "Veuillez saisir votre adresse e-mail ou votre numéro de téléphone enregistré.",
      otpSentSuccessfully:
        "OTP envoyé avec succès.",
      failedToSendOtp:
        "Échec de l'envoi de l'OTP.",
      passwordResetSuccessful:
        "Mot de passe réinitialisé avec succès",
      passwordResetDescription:
        "Votre mot de passe a été réinitialisé avec succès.",
      yourNewPassword:
        "Votre nouveau mot de passe",
      savePassword:
        "Veuillez enregistrer ce mot de passe en toute sécurité.",
      enterOtpDescription:
        "Entrez l'OTP envoyé à votre contact enregistré.",
      phoneNumber:
        "Numéro de téléphone",
      registeredPhonePlaceholder:
        "Entrez votre numéro de téléphone enregistré",
      registeredEmailPlaceholder:
        "Entrez votre e-mail enregistré",
      otpPlaceholder:
        "Entrez l'OTP à 6 chiffres",
      otpValidity:
        "L'OTP est valide pendant 5 minutes.",
      changeEmail:
        "Modifier l'e-mail",
      sending:
        "Envoi...",
      sendOtp:
        "Envoyer l'OTP",
      rememberPassword:
        "Vous souvenez-vous de votre mot de passe ?",
      invalidOtp:
        "OTP invalide",

      communityFeed:
        "Fil communautaire",
      trending:
        "Tendances",
      notifications:
        "Notifications",
      searchHashtag:
        "Rechercher un hashtag...",
      clear:
        "Effacer",
      resultsFor:
        "Résultats pour",
      noNotifications:
        "Aucune notification",
      trendingPosts:
        "Publications populaires",
      noTrendingPosts:
        "Aucune publication populaire",
      likes:
        "J'aime",
      comments:
        "Commentaires",
      shares:
        "Partages",
      noPostsFound:
        "Aucune publication trouvée",
      follow:
        "Suivre",
      saved:
        "Enregistré",
      bookmark:
        "Enregistrer",
      edit:
        "Modifier",
      report:
        "Signaler",
      reportReason:
        "Pourquoi signalez-vous cette publication ?",
      submitReport:
        "Envoyer le signalement",
      writeComment:
        "Écrire un commentaire...",
      comment:
        "Commenter",
      writeReply:
        "Écrire une réponse...",
      reply:
        "Répondre",
      loadingMorePosts:
        "Chargement de publications supplémentaires...",
      noMorePosts:
        "Aucune autre publication",
      confirmDeletePost:
        "Êtes-vous sûr de vouloir supprimer cette publication ?",
      enterReportReason:
        "Veuillez saisir une raison",
      postReportedSuccessfully:
        "Publication signalée avec succès",
      followStatusUpdated:
        "Statut du suivi mis à jour",
      save:
        "Enregistrer",
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,

    lng:
      typeof window !== "undefined"
        ? localStorage.getItem("language") || "en"
        : "en",

    fallbackLng: "en",

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;