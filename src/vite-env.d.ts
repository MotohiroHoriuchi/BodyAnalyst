/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_CLIENT_ID: string;
  readonly VITE_GOOGLE_API_KEY: string;
  readonly VITE_GOOGLE_SPREADSHEET_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Google API types
declare namespace gapi {
  namespace client {
    function init(config: any): Promise<void>;
    function getToken(): any;
    function setToken(token: any): void;

    namespace sheets {
      namespace spreadsheets {
        namespace values {
          function get(params: any): Promise<any>;
          function append(params: any): Promise<any>;
          function update(params: any): Promise<any>;
        }
        function get(params: any): Promise<any>;
        function batchUpdate(params: any): Promise<any>;
      }
    }
  }

  function load(api: string, callback: () => void): void;
}

declare namespace google {
  namespace accounts {
    namespace oauth2 {
      interface TokenClient {
        callback: (response: any) => void;
        requestAccessToken(config: { prompt?: string }): void;
      }

      function initTokenClient(config: any): TokenClient;
      function revoke(token: string, callback: () => void): void;
    }
  }
}
