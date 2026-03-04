import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { validatePin, isPinSet as checkPinSet } from '../services/pinService';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  isPinSet: boolean;
}

export default function PinModal({ visible, onClose, onSuccess, isPinSet }: Props) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    if (!visible) {
      setPin('');
      setError('');
    }
  }, [visible]);

  const handleDigit = (digit: string) => {
    if (locked) return;
    if (pin.length < 6) {
      setPin(pin + digit);
      setError('');
    }
  };

  const handleBackspace = () => {
    if (locked) return;
    setPin(pin.slice(0, -1));
    setError('');
  };

  const handleSubmit = async () => {
    if (locked) return;
    
    if (pin.length < 4) {
      setError('PIN must be at least 4 digits');
      return;
    }

    const isValid = await validatePin(pin);
    
    if (isValid) {
      onSuccess();
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setPin('');
      
      if (newAttempts >= 3) {
        setLocked(true);
        setError('Too many attempts. Wait 30 seconds.');
        setTimeout(() => {
          setLocked(false);
          setAttempts(0);
          setError('');
        }, 30000);
      } else {
        setError(`Incorrect PIN. ${3 - newAttempts} attempts left.`);
      }
    }
  };

  const renderDots = () => {
    const dots = [];
    for (let i = 0; i < 6; i++) {
      dots.push(
        <View key={i} style={[styles.dot, i < pin.length && styles.dotFilled]} />
      );
    }
    return dots;
  };

  const renderKeypad = () => {
    const rows = [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
      ['', '0', 'del'],
    ];

    return rows.map((row, rowIndex) => (
      <View key={rowIndex} style={styles.row}>
        {row.map((key) => {
          if (key === '') {
            return <View key="empty" style={styles.key} />;
          }
          if (key === 'del') {
            return (
              <TouchableOpacity
                key="del"
                style={styles.key}
                onPress={handleBackspace}
                disabled={locked}
              >
                <Text style={styles.keyText}>⌫</Text>
              </TouchableOpacity>
            );
          }
          return (
            <TouchableOpacity
              key={key}
              style={styles.key}
              onPress={() => handleDigit(key)}
              disabled={locked}
            >
              <Text style={styles.keyText}>{key}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    ));
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Enter Parent PIN</Text>
          
          <View style={styles.dotsContainer}>
            {renderDots()}
          </View>
          
          {error ? <Text style={styles.error}>{error}</Text> : null}
          
          {renderKeypad()}
          
          <TouchableOpacity
            style={[styles.submitButton, locked && styles.submitDisabled]}
            onPress={handleSubmit}
            disabled={locked}
          >
            <Text style={styles.submitText}>Submit</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    width: '85%',
    maxWidth: 350,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ccc',
    marginHorizontal: 8,
  },
  dotFilled: {
    backgroundColor: '#4A90D9',
    borderColor: '#4A90D9',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  key: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 35,
  },
  keyText: {
    fontSize: 28,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#4A90D9',
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginTop: 20,
  },
  submitDisabled: {
    backgroundColor: '#ccc',
  },
  submitText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 15,
  },
  closeText: {
    color: '#666',
    fontSize: 16,
  },
  error: {
    color: '#e74c3c',
    marginBottom: 10,
    textAlign: 'center',
  },
});