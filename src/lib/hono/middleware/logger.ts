import type { Context, Next } from 'hono';

// 로그 레벨 정의
enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

// 로거 설정 인터페이스
interface LoggerConfig {
  level: LogLevel;
  logFile: string;
  enableColors: boolean;
  enableJson: boolean;
  enableRequestDetails: boolean;
}

// 기본 설정
const defaultConfig: LoggerConfig = {
  level: process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG,
  logFile: process.env.NODE_ENV === 'production' ? 'logs/error.log' : 'logs/development.log',
  enableColors: process.env.NODE_ENV !== 'production',
  enableJson: process.env.NODE_ENV === 'production',
  enableRequestDetails: true,
};

// 색상 코드 정의
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

// 로그 레벨별 색상
const levelColors = {
  [LogLevel.DEBUG]: colors.dim,
  [LogLevel.INFO]: colors.blue,
  [LogLevel.WARN]: colors.yellow,
  [LogLevel.ERROR]: colors.red,
};

// 요청 정보 수집 함수
const getRequestInfo = (c: Context) => {
  const userAgent = c.req.header('user-agent') || 'Unknown';
  const content_type = c.req.header('content-type') || 'Unknown';
  const accept = c.req.header('accept') || 'Unknown';
  const referer = c.req.header('referer') || 'Direct';

  // IP 주소 추출 (프록시 고려)
  const forwarded_for = c.req.header('x-forwarded-for');
  const realIp = c.req.header('x-real-ip');
  const ip = forwarded_for?.split(',')[0]?.trim() || realIp || 'Unknown';

  return {
    ip,
    userAgent,
    content_type,
    accept,
    referer,
  };
};

// 응답 정보 수집 함수
const get_responseInfo = (c: Context, start_time: number) => {
  const responseTime = Date.now() - start_time;
  const statusCode = c.res.status;
  const contentLength = c.res.headers.get('content-length') || 'Unknown';

  return {
    statusCode,
    responseTime,
    contentLength,
  };
};

// 파일 저장용 로그 메시지 포맷팅 함수 (색상 코드 없음)
const formatLogMessageForFile = (
  level: LogLevel,
  message: string,
  data?: any,
  config: LoggerConfig = defaultConfig,
) => {
  const timestamp = new Date().toISOString();
  const levelName = LogLevel[level];

  if (config.enableJson) {
    return JSON.stringify({
      timestamp,
      level: levelName,
      message,
      ...(data && { data }),
    });
  }

  return `[${timestamp}] ${levelName} ${message}${data ? ` ${JSON.stringify(data)}` : ''}`;
};

// 콘솔 출력용 로그 메시지 포맷팅 함수 (색상 코드 포함)
const formatLogMessageForConsole = (
  level: LogLevel,
  message: string,
  data?: any,
  config: LoggerConfig = defaultConfig,
) => {
  const timestamp = new Date().toISOString();
  const levelName = LogLevel[level];

  if (config.enableJson) {
    return JSON.stringify({
      timestamp,
      level: levelName,
      message,
      ...(data && { data }),
    });
  }

  const color = config.enableColors ? levelColors[level] : '';
  const reset = config.enableColors ? colors.reset : '';
  const bright = config.enableColors ? colors.bright : '';

  return `${color}[${timestamp}] ${bright}${levelName}${reset} ${color}${message}${reset}${
    data ? ` ${JSON.stringify(data)}` : ''
  }`;
};

// 로그 출력 함수
const log = (level: LogLevel, message: string, data?: any, config: LoggerConfig = defaultConfig) => {
  if (level < config.level) return;

  // 콘솔 출력용 메시지 (색상 코드 포함)
  const consoleMessage = formatLogMessageForConsole(level, message, data, config);
  console.log(consoleMessage);
};

// 색상이 포함된 메시지를 위한 특별한 로그 함수
const logWithColor = (
  level: LogLevel,
  fileMessage: string,
  consoleMessage: string,
  data?: any,
  config: LoggerConfig = defaultConfig,
) => {
  if (level < config.level) return;

  // 콘솔 출력용 메시지 (색상 코드 포함)
  const consoleFormattedMessage = formatLogMessageForConsole(level, consoleMessage, data, config);
  console.log(consoleFormattedMessage);
};

// 개선된 로거 미들웨어
export const logger = async (c: Context, next: Next) => {
  const start_time = Date.now();
  const config = defaultConfig;

  try {
    // 요청 시작 로그
    if (config.enableRequestDetails) {
      const requestInfo = getRequestInfo(c);
      log(LogLevel.INFO, `-> ${c.req.method} ${c.req.url}`, requestInfo, config);
    } else {
      log(LogLevel.INFO, `-> ${c.req.method} ${c.req.url}`, undefined, config);
    }

    // 다음 미들웨어 실행
    await next();

    // 응답 완료 로그
    const responseInfo = get_responseInfo(c, start_time);
    const { statusCode, responseTime } = responseInfo;

    // 상태 코드에 따른 로그 레벨 결정
    const log_level = statusCode >= 500 ? LogLevel.ERROR : statusCode >= 400 ? LogLevel.WARN : LogLevel.INFO;

    const status_color = config.enableColors
      ? statusCode >= 500
        ? colors.red
        : statusCode >= 400
          ? colors.yellow
          : colors.green
      : '';
    const reset = config.enableColors ? colors.reset : '';

    // 콘솔용 메시지 (색상 포함)
    const consoleMessage = `<- ${c.req.method} ${c.req.url} ${status_color}${statusCode}${reset} - ${responseTime}ms`;

    // 파일용 메시지 (색상 없음)
    const fileMessage = `<- ${c.req.method} ${c.req.url} ${statusCode} - ${responseTime}ms`;

    logWithColor(
      log_level,
      fileMessage, // 파일 저장용 메시지
      consoleMessage, // 콘솔 출력용 메시지
      config.enableRequestDetails ? responseInfo : undefined,
      config,
    );
  } catch (error) {
    // 에러 발생 시 로그
    const responseInfo = get_responseInfo(c, start_time);
    log(
      LogLevel.ERROR,
      `X ${c.req.method} ${c.req.url} - Error occurred`,
      {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        ...responseInfo,
      },
      config,
    );

    throw error; // 에러를 다시 던져서 상위에서 처리하도록
  }
};

// 로거 설정 함수 (선택적)
export const configure_logger = (newConfig: Partial<LoggerConfig>) => {
  Object.assign(defaultConfig, newConfig);
};

// 개별 로그 함수들 (다른 곳에서 사용 가능)
export const logger_utils = {
  debug: (message: string, data?: any) => log(LogLevel.DEBUG, message, data),
  info: (message: string, data?: any) => log(LogLevel.INFO, message, data),
  warn: (message: string, data?: any) => log(LogLevel.WARN, message, data),
  error: (message: string, data?: any) => log(LogLevel.ERROR, message, data),
};
