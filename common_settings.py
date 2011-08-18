import os

LOGIN_URL = "/login/"
REDIRECT_FIELD_NAME = None


# sendGrid api configuration
EMAIL_HOST = 'smtp.sendgrid.net'
EMAIL_HOST_USER = '****'
EMAIL_HOST_PASSWORD = '****'
EMAIL_PORT = 587
EMAIL_USE_TLS = True


DEBUG = True
TEMPLATE_DEBUG = DEBUG

ADMINS = (
    # ('Your Name', 'your_email@example.com'),
)

MANAGERS = ADMINS
STATIC_FILE_PATH = os.path.join(os.getcwd(), "static")
DB_PATH = STATIC_FILE_PATH + '/am.db'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': DB_PATH,
        'USER': '',
        'PASSWORD': '',
        'HOST': '',
        'PORT': '',
    }
}

TIME_ZONE = 'America/Chicago'

LANGUAGE_CODE = 'en-us'

SITE_ID = 1
USE_I18N = True
USE_L10N = True
MEDIA_ROOT = STATIC_FILE_PATH#''
MEDIA_URL = ''
STATIC_ROOT = ''
STATIC_URL = STATIC_FILE_PATH
ADMIN_MEDIA_PREFIX = '/static/admin/'
STATICFILES_DIRS = (
)

STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
)

SECRET_KEY = '4am#_5(#jgpge+ex-%$_r54t5t+#&-rz#cn=jae0uw0i##zzew'

TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
)

MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
)

ROOT_URLCONF = 'gridtest.urls'


TEMPLATE_DIRS = (
    os.path.join(os.getcwd(), 'grid/templates')
)

INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'grid',
    #'django.contrib.admin',
)


LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'class': 'django.utils.log.AdminEmailHandler'
        }
    },
    'loggers': {
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': True,
        },
    }
}
AUTHENTICATION_BACKENDS = ('grid.Authbackend.ExcelAuthBackend',)

