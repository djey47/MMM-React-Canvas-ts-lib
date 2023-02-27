import React from 'react';
import { createRoot } from 'react-dom/client';
import ConfigurationContext from '../contexts/ConfigurationContext';

/**
 * MagicMirror
 * HTML renderer
 */

export interface MainComponentInfo {
  Component: React.ComponentClass;
  props?: object;
}

/**
 * @returns HTML for main wrapper
 */
export const renderWrapper = (wrapperId: string): HTMLDivElement => {
  const wrapper = document.createElement('div');
  wrapper.id = wrapperId;
  wrapper.className = wrapperId;

  return wrapper;
};

/**
 * REACT gateway helper
 * @return Mounted component
 */
export const renderMainComponent = (wrapperId: string, mainComponent: MainComponentInfo, config?: ModuleConfiguration): void => {
  const wrapperElement = document.getElementById(wrapperId);
  if (!wrapperElement) {
    Log.error(`** Could not find root div with id: ${wrapperId}! Aborting.`);
    return;
  }

  const { Component: C, props } = mainComponent;
  const root = createRoot(wrapperElement);
  root.render(
    <ConfigurationContext.Provider value={config}>
      <C {...props} />
    </ConfigurationContext.Provider>
  );
};
