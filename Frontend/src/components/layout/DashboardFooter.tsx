import "../../DashboardPage.css";

export default function DashboardFooter() {
  return (
    <footer className="dashboard-footer">
      <div className="dashboard-footer-inner">
        <p className="text-[13px] text-white/70">
          Money Confidence for Life &mdash; Level Up Your Future
        </p>
        <p className="text-[13px] text-white/50">
          &copy; {new Date().getFullYear()} MCFL
        </p>
      </div>
    </footer>
  );
}
