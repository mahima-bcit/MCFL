import Button from "../ui/Button";

export default function Navbar() {
  return (
    <nav className="bg-nav text-white px-8 py-4 flex items-center justify-between">
     <div className="flex items-center gap-3">
       
        <img 
          src="/logo.png" 
          alt="Money Confidence for Life Logo" 
          className="h-10 w-auto" 
        />
        <span className="font-bold text-lg hidden md:block"> 
          Money Confidence for Life
        </span>
      </div>
      <div className="flex gap-6 text-sm">
        <a href="#" className="hover:text-gold transition-colors">Features</a>
        <a href="#" className="hover:text-gold transition-colors">Pricing</a>
      </div>
      <Button>Get Started</Button>
    </nav>
  )
}