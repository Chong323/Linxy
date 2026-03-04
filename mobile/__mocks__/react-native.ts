import React from 'react';

const ReactNative = {
  ...React,
  View: ({ children }: any) => React.createElement('View', null, children),
  ActivityIndicator: (props: any) => React.createElement('ActivityIndicator', props),
  Text: ({ children }: any) => React.createElement('Text', null, children),
  TextInput: (props: any) => React.createElement('TextInput', props),
  TouchableOpacity: ({ children, onPress }: any) =>
    React.createElement('TouchableOpacity', { onPress }, children),
  ScrollView: ({ children }: any) =>
    React.createElement('ScrollView', null, children),
  FlatList: ({ data, renderItem, keyExtractor }: any) =>
    React.createElement('FlatList', { data, renderItem, keyExtractor }),
  KeyboardAvoidingView: ({ children }: any) =>
    React.createElement('KeyboardAvoidingView', null, children),
  Button: ({ title, onPress }: any) =>
    React.createElement('button', { onClick: onPress }, title),
  Alert: {
    alert: jest.fn(),
  },
  StyleSheet: {
    create: (styles: any) => styles,
    flatten: (style: any) => {
      if (!style) return {};
      if (Array.isArray(style)) return Object.assign({}, ...style);
      return style;
    },
  },
  Platform: {
    OS: 'ios',
    select: (obj: any) => obj.ios || obj.default,
  },
};

export default ReactNative;
export const {
  View,
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  KeyboardAvoidingView,
  Button,
  Alert,
  StyleSheet,
  Platform,
} = ReactNative;