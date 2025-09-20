import TrainerDashboard from '../TrainerDashboard';

export default function TrainerDashboardExample() {
  //todo: remove mock functionality 
  const mockTrainer = {
    name: "Lucas",
    avatar: undefined
  };

  return <TrainerDashboard trainer={mockTrainer} />;
}