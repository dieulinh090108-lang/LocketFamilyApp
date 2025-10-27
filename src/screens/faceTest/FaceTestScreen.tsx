import React, { memo, useEffect, useState, useCallback } from "react";
import { Text, View, StyleSheet, TouchableOpacity, ActivityIndicator, Image, useWindowDimensions, Vibration, Modal } from "react-native";
import { COLORS } from "../../constants";
import Ionicons from '@react-native-vector-icons/ionicons';
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../assets";
import Tts from 'react-native-tts';


type MOCK_TEST_DATA_TYPE = Array<{
  images: any;
  options: string[];
  answer: string;
}>;

const MOCK_TEST_DATA: MOCK_TEST_DATA_TYPE = [
  {
    images: images.chiLinhChi,
    options: ["Lê Linh Chi", "Nguyễn Văn B", "Nguyễn Văn C", "Nguyễn Văn D"],
    answer: "Lê Linh Chi",
  },
  {
    images: images.bacHoa,
    options: ["Nguyễn Thị Hoà", "Nguyễn Văn B", "Nguyễn Văn C", "Nguyễn Văn D"],
    answer: "Nguyễn Thị Hoà",
  },
  {
    images: images.chiThuy,
    options: ["Nguyễn Thị Thúy", "Nguyễn Văn B", "Nguyễn Văn C", "Nguyễn Văn D"],
    answer: "Nguyễn Thị Thúy",
  },
  {
    images: images.leQuangTang,
    options: ["Lê Quang Tăng", "Nguyễn Văn B", "Nguyễn Văn C", "Nguyễn Văn D"],
    answer: "Lê Quang Tăng",
  },
  {
    images: images.leVietBach,
    options: ["Lê Việt Bách", "Nguyễn Văn B", "Nguyễn Văn C", "Nguyễn Văn D"],
    answer: "Lê Việt Bách",
  },
  {
    images: images.nguyenDinhDong,
    options: ["Nguyễn Đình Đồng", "Nguyễn Văn B", "Nguyễn Văn C", "Nguyễn Văn D"],
    answer: "Nguyễn Đình Đồng",
  },
];

const FaceTestScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const [progressWidth, setProgressWidth] = useState(0);
  const [testData, setTestData] = useState<MOCK_TEST_DATA_TYPE | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [blinkOn, setBlinkOn] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    // Mô phỏng tải dữ liệu test từ server
    setLoading(true);
    setTimeout(() => {
      setTestData(MOCK_TEST_DATA);
      setLoading(false);
    }, 2000);
  }, []);

  const handleBack = () => {
    navigation.goBack();
  };

  // Prepare TTS configuration once
  useEffect(() => {
    Tts.setDefaultLanguage('vi-VN').catch(() => { });
    Tts.setDefaultRate(0.45).catch(() => { });
    Tts.setDefaultPitch(1.0).catch(() => { });
  }, []);

  const onSelectOption = useCallback((option: string) => {
    if (hasAnswered) return; // allow change until confirm
    setSelected(option);
    // Speak selected option
    Tts.stop();
    Tts.speak(option);
  }, [hasAnswered]);

  const safeVibrate = useCallback((pattern: number | number[]) => {
    try {
      // On iOS, vibration is allowed without extra permission; on Android, ensure manifest has VIBRATE
      Vibration.vibrate(pattern);
    } catch (e) {
      console.warn('Vibration failed', e);
    }
  }, []);

  const confirmAnswer = useCallback(() => {
    if (!testData || selected == null) return;
    const answer = testData[currentIndex].answer;
    const correct = selected === answer;
    setHasAnswered(true);
    setIsCorrect(correct);
    if (correct) {
      setScore((s) => s + 1);
      safeVibrate(40);
      Tts.speak('Đúng rồi');
    } else {
      safeVibrate([0, 60, 40]);
      Tts.speak('Chưa đúng, hãy thử lại lần sau');
    }
    // Blink effect for feedback, then navigate next
    const toggles = 4;
    for (let i = 0; i < toggles; i++) {
      setTimeout(() => setBlinkOn((b) => !b), i * 180);
    }
    setTimeout(() => {
      const next = currentIndex + 1;
      if (next < (testData?.length || 0)) {
        setCurrentIndex(next);
        setSelected(null);
        setIsCorrect(null);
        setHasAnswered(false);
        setBlinkOn(false);
      } else {
        // Finished all
        setShowResult(true);
      }
    }, toggles * 180 + 200);
  }, [testData, selected, currentIndex, safeVibrate]);

  // Removed goNext: navigation is handled inside confirmAnswer

  const restart = useCallback(() => {
    setCurrentIndex(0);
    setSelected(null);
    setIsCorrect(null);
    setHasAnswered(false);
    setBlinkOn(false);
    setScore(0);
  }, []);

  const renderTestQuestion = useCallback(({ item, index }: { item: { images: any; options: string[]; answer: string }; index: number }) => {
    const isActive = index === currentIndex;
    return (
      <View style={[styles.slide, { width }]}
        accessibilityRole="summary"
        accessibilityLabel={`Câu hỏi ${index + 1}`}>
        <View style={styles.topArea}>
          <View style={styles.imageBox}>
            <Image source={item.images} resizeMode="contain" style={styles.image} />
          </View>
        </View>
        <View style={styles.bottomArea}>
          <Text style={styles.questionText}>Ai đây?</Text>
          <View style={styles.optionsGrid}>
            {item.options.map((opt) => {
              const isChosen = selected === opt;
              const isRightAnswer = opt === item.answer;
              // Style BEFORE confirmation: neutral; highlight selection subtly
              const preConfirmStyle = !hasAnswered
                ? {
                  backgroundColor: isChosen ? COLORS.surfaceSecondary : COLORS.surface,
                  borderColor: isChosen ? COLORS.primary : COLORS.grayLight,
                  textColor: COLORS.textPrimary,
                }
                : null;
              // Style AFTER confirmation
              let postBg: string = COLORS.surface;
              let postBorder: string = COLORS.grayLight;
              let postText: string = COLORS.textPrimary;
              if (hasAnswered) {
                if (isCorrect && isChosen) {
                  // Blink green on correct selection
                  postBg = blinkOn ? COLORS.success : COLORS.surface;
                  postBorder = COLORS.success;
                  postText = COLORS.black;
                } else if (!isCorrect && isChosen) {
                  // Blink red on wrong selection
                  postBg = blinkOn ? COLORS.error : COLORS.surface;
                  postBorder = COLORS.error;
                  postText = COLORS.black;
                } else if (!isCorrect && isRightAnswer) {
                  // Show correct answer in green only when user answered wrong
                  postBg = COLORS.success;
                  postBorder = COLORS.success;
                  postText = COLORS.black;
                }
              }
              const bg = hasAnswered ? postBg : preConfirmStyle!.backgroundColor;
              const border = hasAnswered ? postBorder : preConfirmStyle!.borderColor;
              const color = hasAnswered ? postText : preConfirmStyle!.textColor;
              return (
                <TouchableOpacity
                  key={opt}
                  style={[styles.optionCell, styles.optionBtn, { backgroundColor: bg, borderColor: border }]}
                  activeOpacity={0.85}
                  disabled={!isActive || hasAnswered}
                  onPress={() => onSelectOption(opt)}
                  accessibilityRole="button"
                  accessibilityState={{ disabled: !isActive || hasAnswered, selected: selected === opt }}
                  accessibilityLabel={`Lựa chọn ${opt}`}
                >
                  <Text style={[styles.optionText, { color }]}>{opt}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.footerRow}>
            <View style={styles.footerSpacer} />
            <TouchableOpacity
              onPress={confirmAnswer}
              disabled={currentIndex !== index || selected == null || hasAnswered}
              style={[styles.primaryBtn, (currentIndex !== index || selected == null || hasAnswered) && styles.btnDisabled]}
              accessibilityRole="button"
              accessibilityState={{ disabled: currentIndex !== index || selected == null || hasAnswered }}
              accessibilityLabel="Trả lời"
            >
              <Text style={styles.primaryBtnText}>Trả lời</Text>
              <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }, [currentIndex, isCorrect, onSelectOption, confirmAnswer, hasAnswered, selected, width, blinkOn]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
          <Ionicons name="arrow-back" size={25} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Kiểm tra trí nhớ</Text>
      </View>
      {/* Progress bar */}
      {!!testData && (
        <View
          style={styles.progressBarWrapper}
          onLayout={(e) => setProgressWidth(e.nativeEvent.layout.width)}
        >
          <View style={[
            styles.progressFill,
            // Progress starts at 0 and only advances after confirming an answer
            { width: progressWidth * ((currentIndex + (hasAnswered ? 1 : 0)) / testData.length) }
          ]} />
        </View>
      )}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size={50} color={COLORS.loading} />
          <Text style={styles.loadingText}>Đang chuẩn bị câu hỏi…</Text>
        </View>
      ) : (
        testData && renderTestQuestion({ item: testData[currentIndex], index: currentIndex })
      )}
      {/* Result modal when finished */}
      <Modal visible={showResult} transparent animationType="fade" onRequestClose={() => setShowResult(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.summaryBox}>
            <Ionicons name="ribbon" size={36} color={COLORS.primary} />
            <Text style={styles.summaryTitle}>Hoàn thành</Text>
            <Text style={styles.summaryText}>Điểm của bạn: {score} / {testData?.length || 0}</Text>
            <View style={styles.summaryButtons}>
              <TouchableOpacity style={styles.secondaryBtn} onPress={() => { setShowResult(false); restart(); }}>
                <Ionicons name="refresh" size={20} color={COLORS.white} />
                <Text style={styles.secondaryBtnText}>Làm lại</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryBtn} onPress={handleBack}>
                <Text style={styles.primaryBtnText}>Quay lại</Text>
                <Ionicons name="home" size={18} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default memo(FaceTestScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundColor,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    justifyContent: 'flex-start',
  },
  backBtn: {
    backgroundColor: COLORS.secondary,
    padding: 12,
    borderRadius: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.black,
    marginLeft: 16,
  },
  progressBarWrapper: {
    height: 8,
    backgroundColor: COLORS.surfaceSecondary,
    marginHorizontal: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  slide: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  list: { flex: 1 },
  topArea: {
    flex: 3,
  },
  bottomArea: {
    flex: 2,
  },
  imageBox: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: COLORS.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  questionText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 8,
    marginBottom: 6,
    textAlign: 'center',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  optionCell: {
    width: '48%',
    marginBottom: 8,
  },
  optionBtn: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 2,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  footerRow: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  footerSpacer: { width: 120 },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    gap: 8,
    minWidth: 120,
  },
  primaryBtnText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.grayDark,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    gap: 8,
    minWidth: 110,
  },
  secondaryBtnText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '600',
  },
  btnDisabled: {
    backgroundColor: COLORS.grayLight,
  },
  summaryOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 16,
    alignItems: 'center',
  },
  summaryBox: {
    width: '92%',
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 8,
  },
  summaryText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginVertical: 8,
  },
  summaryButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
});