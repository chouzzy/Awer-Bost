(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(global, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("electron");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*************************!*\
  !*** ./main/preload.ts ***!
  \*************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron */ "electron");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);

const handler = {
  send(channel, value) {
    electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.send(channel, value);
  },
  on(channel, callback) {
    const subscription = (_event, ...args) => callback(...args);
    electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.on(channel, subscription);
    return () => {
      electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.removeListener(channel, subscription);
    };
  },
  sendMessage: message => electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.send('send-message', message),
  dateSelected: date => electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.send('date-selected', date),
  saveFile: () => electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke('dialog:saveFile'),
  // ipcMain.handle('dialog:saveFile', async () => {
  // })

  callFront: callback => electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.on('call-front', (_event, value) => callback(value)),
  isLoading: callback => electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.on('is-loading', (_event, value) => callback(value)),
  loginError: callback => electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.on('login-error', (_event, value) => callback(value)),
  scrapeData: scrapeData => electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.send('scrape-data', scrapeData),
  saveExcel: async () => electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.send('save-excel'),
  processFinished: callback => electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.on('process-finished', (_event, value) => callback(value)),
  sendExcelPath: async ({
    excelPath,
    operationType
  }) => electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.send('send-excel-path', {
    excelPath,
    operationType
  }),
  progressPercentual: callback => electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.on('progress-percentual', (_event, value) => callback(value)),
  processosEncontrados: callback => electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.on('processos-encontrados', (_event, value) => callback(value)),
  invalidExcelFormat: callback => electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.on('invalid-excel-format', (_event, value) => callback(value)),
  progressMessagesDetails: callback => electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.on('progress-messages', (_event, value) => callback(value))
};
electron__WEBPACK_IMPORTED_MODULE_0__.contextBridge.exposeInMainWorld('ipc', handler);
})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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cEIsUUFBUSxJQUFLTixpREFBVyxDQUFDSyxFQUFFLENBQUMscUJBQXFCLEVBQUUsQ0FBQ0csTUFBTSxFQUFFSixLQUFLLEtBQUtFLFFBQVEsQ0FBQ0YsS0FBSyxDQUFDLENBQUM7RUFFM0d1QixvQkFBb0IsRUFBR3JCLFFBQVEsSUFBS04saURBQVcsQ0FBQ0ssRUFBRSxDQUFDLHVCQUF1QixFQUFFLENBQUNHLE1BQU0sRUFBRUosS0FBSyxLQUFLRSxRQUFRLENBQUNGLEtBQUssQ0FBQyxDQUFDO0VBRS9Hd0Isa0JBQWtCLEVBQUd0QixRQUFRLElBQUtOLGlEQUFXLENBQUNLLEVBQUUsQ0FBQyxzQkFBc0IsRUFBRSxDQUFDRyxNQUFNLEVBQUVKLEtBQUssS0FBS0UsUUFBUSxDQUFDRixLQUFLLENBQUMsQ0FBQztFQUU1R3lCLHVCQUF1QixFQUFHdkIsUUFBUSxJQUFLTixpREFBVyxDQUFDSyxFQUFFLENBQUMsbUJBQW1CLEVBQUUsQ0FBQ0csTUFBTSxFQUFFSixLQUFLLEtBQUtFLFFBQVEsQ0FBQ0YsS0FBSyxDQUFDO0FBQy9HLENBQUM7QUFFREwsbURBQWEsQ0FBQytCLGlCQUFpQixDQUFDLEtBQUssRUFBRTdCLE9BQU8sQ0FBQyxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYm9UUlQvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL2JvVFJUL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJlbGVjdHJvblwiIiwid2VicGFjazovL2JvVFJUL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JvVFJUL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2JvVFJUL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9ib1RSVC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JvVFJUL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYm9UUlQvLi9tYWluL3ByZWxvYWQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIHtcblx0XHR2YXIgYSA9IGZhY3RvcnkoKTtcblx0XHRmb3IodmFyIGkgaW4gYSkgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyA/IGV4cG9ydHMgOiByb290KVtpXSA9IGFbaV07XG5cdH1cbn0pKGdsb2JhbCwgKCkgPT4ge1xucmV0dXJuICIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImVsZWN0cm9uXCIpOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBjb250ZXh0QnJpZGdlLCBpcGNSZW5kZXJlciwgSXBjUmVuZGVyZXJFdmVudCB9IGZyb20gJ2VsZWN0cm9uJ1xyXG5pbXBvcnQgeyBkYXRlU2VsZWN0ZWQsIGltcG9ydERhdGFQcm9wcywgU2NyYXBlRGF0YSB9IGZyb20gJy4vaGVscGVycy90eXBlcy9nZW5lcmFsVHlwZXMnXHJcblxyXG5jb25zdCBoYW5kbGVyID0ge1xyXG4gIHNlbmQoY2hhbm5lbDogc3RyaW5nLCB2YWx1ZTogdW5rbm93bikge1xyXG4gICAgaXBjUmVuZGVyZXIuc2VuZChjaGFubmVsLCB2YWx1ZSlcclxuICB9LFxyXG4gIG9uKGNoYW5uZWw6IHN0cmluZywgY2FsbGJhY2s6ICguLi5hcmdzOiB1bmtub3duW10pID0+IHZvaWQpIHtcclxuICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IChfZXZlbnQ6IElwY1JlbmRlcmVyRXZlbnQsIC4uLmFyZ3M6IHVua25vd25bXSkgPT5cclxuICAgICAgY2FsbGJhY2soLi4uYXJncylcclxuICAgIGlwY1JlbmRlcmVyLm9uKGNoYW5uZWwsIHN1YnNjcmlwdGlvbilcclxuXHJcbiAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICBpcGNSZW5kZXJlci5yZW1vdmVMaXN0ZW5lcihjaGFubmVsLCBzdWJzY3JpcHRpb24pXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgc2VuZE1lc3NhZ2U6IChtZXNzYWdlOiBzdHJpbmcpID0+IGlwY1JlbmRlcmVyLnNlbmQoJ3NlbmQtbWVzc2FnZScsIG1lc3NhZ2UpLFxyXG5cclxuICBkYXRlU2VsZWN0ZWQ6IChkYXRlOiBkYXRlU2VsZWN0ZWQpID0+IGlwY1JlbmRlcmVyLnNlbmQoJ2RhdGUtc2VsZWN0ZWQnLCBkYXRlKSxcclxuXHJcbiAgc2F2ZUZpbGU6ICgpID0+IGlwY1JlbmRlcmVyLmludm9rZSgnZGlhbG9nOnNhdmVGaWxlJyksXHJcbiAgLy8gaXBjTWFpbi5oYW5kbGUoJ2RpYWxvZzpzYXZlRmlsZScsIGFzeW5jICgpID0+IHtcclxuICAvLyB9KVxyXG5cclxuICBjYWxsRnJvbnQ6IChjYWxsYmFjaykgPT4gaXBjUmVuZGVyZXIub24oJ2NhbGwtZnJvbnQnLCAoX2V2ZW50LCB2YWx1ZSkgPT4gY2FsbGJhY2sodmFsdWUpKSxcclxuXHJcbiAgaXNMb2FkaW5nOiAoY2FsbGJhY2spID0+IGlwY1JlbmRlcmVyLm9uKCdpcy1sb2FkaW5nJywgKF9ldmVudCwgdmFsdWUpID0+IGNhbGxiYWNrKHZhbHVlKSksXHJcbiAgXHJcbiAgbG9naW5FcnJvcjogKGNhbGxiYWNrKSA9PiBpcGNSZW5kZXJlci5vbignbG9naW4tZXJyb3InLCAoX2V2ZW50LCB2YWx1ZSkgPT4gY2FsbGJhY2sodmFsdWUpKSxcclxuICBcclxuICBzY3JhcGVEYXRhOiAoc2NyYXBlRGF0YTogU2NyYXBlRGF0YSkgPT4gaXBjUmVuZGVyZXIuc2VuZCgnc2NyYXBlLWRhdGEnLCBzY3JhcGVEYXRhKSxcclxuICBcclxuICBzYXZlRXhjZWw6IGFzeW5jICgpID0+IGlwY1JlbmRlcmVyLnNlbmQoJ3NhdmUtZXhjZWwnKSxcclxuICBcclxuICBwcm9jZXNzRmluaXNoZWQ6IChjYWxsYmFjaykgPT4gaXBjUmVuZGVyZXIub24oJ3Byb2Nlc3MtZmluaXNoZWQnLCAoX2V2ZW50LCB2YWx1ZSkgPT4gY2FsbGJhY2sodmFsdWUpKSxcclxuICBcclxuICBzZW5kRXhjZWxQYXRoOiBhc3luYyAoeyBleGNlbFBhdGgsIG9wZXJhdGlvblR5cGUgfTogaW1wb3J0RGF0YVByb3BzKSA9PiBpcGNSZW5kZXJlci5zZW5kKCdzZW5kLWV4Y2VsLXBhdGgnLCB7IGV4Y2VsUGF0aCwgb3BlcmF0aW9uVHlwZSB9KSxcclxuICBcclxuICBwcm9ncmVzc1BlcmNlbnR1YWw6IChjYWxsYmFjaykgPT4gaXBjUmVuZGVyZXIub24oJ3Byb2dyZXNzLXBlcmNlbnR1YWwnLCAoX2V2ZW50LCB2YWx1ZSkgPT4gY2FsbGJhY2sodmFsdWUpKSxcclxuXHJcbiAgcHJvY2Vzc29zRW5jb250cmFkb3M6IChjYWxsYmFjaykgPT4gaXBjUmVuZGVyZXIub24oJ3Byb2Nlc3Nvcy1lbmNvbnRyYWRvcycsIChfZXZlbnQsIHZhbHVlKSA9PiBjYWxsYmFjayh2YWx1ZSkpLFxyXG5cclxuICBpbnZhbGlkRXhjZWxGb3JtYXQ6IChjYWxsYmFjaykgPT4gaXBjUmVuZGVyZXIub24oJ2ludmFsaWQtZXhjZWwtZm9ybWF0JywgKF9ldmVudCwgdmFsdWUpID0+IGNhbGxiYWNrKHZhbHVlKSksXHJcblxyXG4gIHByb2dyZXNzTWVzc2FnZXNEZXRhaWxzOiAoY2FsbGJhY2spID0+IGlwY1JlbmRlcmVyLm9uKCdwcm9ncmVzcy1tZXNzYWdlcycsIChfZXZlbnQsIHZhbHVlKSA9PiBjYWxsYmFjayh2YWx1ZSkpLFxyXG59XHJcblxyXG5jb250ZXh0QnJpZGdlLmV4cG9zZUluTWFpbldvcmxkKCdpcGMnLCBoYW5kbGVyKVxyXG5cclxuZXhwb3J0IHR5cGUgSXBjSGFuZGxlciA9IHR5cGVvZiBoYW5kbGVyXHJcbiJdLCJuYW1lcyI6WyJjb250ZXh0QnJpZGdlIiwiaXBjUmVuZGVyZXIiLCJoYW5kbGVyIiwic2VuZCIsImNoYW5uZWwiLCJ2YWx1ZSIsIm9uIiwiY2FsbGJhY2siLCJzdWJzY3JpcHRpb24iLCJfZXZlbnQiLCJhcmdzIiwicmVtb3ZlTGlzdGVuZXIiLCJzZW5kTWVzc2FnZSIsIm1lc3NhZ2UiLCJkYXRlU2VsZWN0ZWQiLCJkYXRlIiwic2F2ZUZpbGUiLCJpbnZva2UiLCJjYWxsRnJvbnQiLCJpc0xvYWRpbmciLCJsb2dpbkVycm9yIiwic2NyYXBlRGF0YSIsInNhdmVFeGNlbCIsInByb2Nlc3NGaW5pc2hlZCIsInNlbmRFeGNlbFBhdGgiLCJleGNlbFBhdGgiLCJvcGVyYXRpb25UeXBlIiwicHJvZ3Jlc3NQZXJjZW50dWFsIiwicHJvY2Vzc29zRW5jb250cmFkb3MiLCJpbnZhbGlkRXhjZWxGb3JtYXQiLCJwcm9ncmVzc01lc3NhZ2VzRGV0YWlscyIsImV4cG9zZUluTWFpbldvcmxkIl0sInNvdXJjZVJvb3QiOiIifQ==