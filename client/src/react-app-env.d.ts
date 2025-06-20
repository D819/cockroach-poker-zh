/// <reference types="react-scripts" />

import 'react-i18next';
import { ReactNode } from 'react';

declare module 'react-i18next' {
  interface TFunctionResult {
    toString(): string;
  }
}

declare module 'i18next' {
  type TFunctionResult = ReactNode;
}

// 添加window.process的类型声明
interface ProcessEnv {
  NODE_ENV: string;
  PUBLIC_URL: string;
  [key: string]: string | undefined;
}

interface Process {
  env: ProcessEnv;
}

declare global {
  interface Window {
    process?: Process;
  }
}
