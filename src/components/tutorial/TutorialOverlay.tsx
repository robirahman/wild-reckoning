import styles from '../../styles/tutorial.module.css';

interface TutorialStep {
  title: string;
  description: string;
}

const STEPS: TutorialStep[] = [
  {
    title: 'Welcome to Wild Reckoning',
    description:
      'You are an animal trying to survive in the wild. Each turn, you\'ll face events that require decisions. ' +
      'Your choices affect your stats, health, and ultimately whether you live or die.',
  },
  {
    title: 'Events & Choices',
    description:
      'The center panel shows events happening around you. Some require a choice — read carefully and pick ' +
      'the option that best fits your survival strategy. After choosing, click "Next Turn" to see what happens.',
  },
  {
    title: 'Stats & Health',
    description:
      'The sidebar shows your vital stats like Health, Strength, and Trauma. Watch for trend arrows — ' +
      'they show whether a stat is rising or falling. Hover over any stat for details and active modifiers.',
  },
  {
    title: 'Behavioral Settings',
    description:
      'The bottom panel lets you adjust your behavioral tendencies like foraging intensity, caution around ' +
      'predators, and sociability. These settings influence which events you encounter and their outcomes.',
  },
];

interface Props {
  step: number;
  onNext: () => void;
  onSkip: () => void;
}

export function TutorialOverlay({ step, onNext, onSkip }: Props) {
  const currentStep = STEPS[step];
  if (!currentStep) return null;

  const isLast = step === STEPS.length - 1;

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <div className={styles.stepIndicator}>
          Step {step + 1} of {STEPS.length}
        </div>
        <div className={styles.title}>{currentStep.title}</div>
        <div className={styles.description}>{currentStep.description}</div>
        <div className={styles.actions}>
          <button className={styles.skipButton} onClick={onSkip}>
            Skip Tutorial
          </button>
          <button className={styles.continueButton} onClick={onNext}>
            {isLast ? 'Got It' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
