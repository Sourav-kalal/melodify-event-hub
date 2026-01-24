import { Link } from "react-router-dom";
import { Music, Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-hero flex items-center justify-center">
                <Music className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-serif text-xl font-semibold">
                Sangeet Academy
              </span>
            </Link>
            <p className="text-secondary-foreground/70 text-sm">
              Where passion meets excellence. Learn music from the best
              instructors in a nurturing environment.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/courses"
                  className="text-secondary-foreground/70 hover:text-accent transition-colors text-sm"
                >
                  Our Courses
                </Link>
              </li>
              <li>
                <Link
                  to="/events"
                  className="text-secondary-foreground/70 hover:text-accent transition-colors text-sm"
                >
                  Upcoming Events
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-secondary-foreground/70 hover:text-accent transition-colors text-sm"
                >
                  Register Now
                </Link>
              </li>
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">Popular Courses</h4>
            <ul className="space-y-2">
              {["Guitar", "Piano", "Vocals", "Tabla", "Drums"].map((course) => (
                <li key={course}>
                  <Link
                    to="/courses"
                    className="text-secondary-foreground/70 hover:text-accent transition-colors text-sm"
                  >
                    {course}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-secondary-foreground/70 text-sm">
                <Phone className="w-4 h-4 text-accent" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2 text-secondary-foreground/70 text-sm">
                <Mail className="w-4 h-4 text-accent" />
                <span>info@sangeetacademy.com</span>
              </li>
              <li className="flex items-start gap-2 text-secondary-foreground/70 text-sm">
                <MapPin className="w-4 h-4 text-accent mt-0.5" />
                <span>123 Music Lane, Melody City, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-secondary-foreground/10">
          <p className="text-center text-secondary-foreground/50 text-sm">
            © {new Date().getFullYear()} Sangeet Academy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
