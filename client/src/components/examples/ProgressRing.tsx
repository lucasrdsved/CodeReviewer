import ProgressRing from '../ProgressRing';

export default function ProgressRingExample() {
  return (
    <div className="flex gap-6 p-4">
      <ProgressRing progress={75}>
        <div className="text-center">
          <div className="text-2xl font-bold">75%</div>
          <div className="text-xs text-muted-foreground">Concluído</div>
        </div>
      </ProgressRing>
      
      <ProgressRing progress={30} size={80}>
        <div className="text-center">
          <div className="text-lg font-bold">30%</div>
        </div>
      </ProgressRing>
    </div>
  );
}