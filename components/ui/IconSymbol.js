import React from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function IconSymbol({ name, size = 24, color = "#333" }) {
  // Optional safety: fallback to a default icon if name is missing
  const safeName = typeof name === 'string' ? name : 'help-circle';

  return (
    <Ionicons
      name={safeName}
      size={size}
      color={color}
    />
  );
};
