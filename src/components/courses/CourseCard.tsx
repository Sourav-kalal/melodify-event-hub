import { motion } from "framer-motion";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCourseImage } from "@/lib/courseImages";
import { EnrollmentFormDialog } from "./EnrollmentFormDialog";

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  level: string;
  upiPrice?: number;
  imageUrl?: string;
  index?: number;
}

export function CourseCard({
  title,
  description,
  level,
  upiPrice,
  imageUrl,
  whatsappNumber,
  googleFormLink,
  globalWhatsappNumber,
  index = 0,
}: CourseCardProps) {
  const image = imageUrl || getCourseImage(title);
  const whatsapp = whatsappNumber || globalWhatsappNumber || "+919876543210";
  const formLink = googleFormLink || "https://forms.google.com";

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Hi, I'm interested in the ${title} course. Please share details.`
    );
    const phone = whatsapp.replace(/[^0-9]/g, "");
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  const handleJoinNow = () => {
    window.open(formLink, "_blank");
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "Intermediate":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "Advanced":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      default:
        return "bg-primary/10 text-primary border-primary/20";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300 border border-border"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <Badge
          className={`absolute top-4 right-4 ${getLevelColor(level)}`}
          variant="outline"
        >
          {level}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-serif text-xl font-bold text-card-foreground mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {description}
        </p>

        {upiPrice && (
          <div className="mb-4">
            <span className="text-2xl font-bold text-primary">
              ₹{upiPrice.toLocaleString("en-IN")}
            </span>
            <span className="text-muted-foreground text-sm ml-1">/course</span>
          </div>
        )}

        {/* Actions */}
        <EnrollmentFormDialog courseId={id} courseTitle={title}>
          <Button variant="hero" size="sm" className="w-full">
            <CreditCard className="w-4 h-4" />
            Enroll Now
          </Button>
        </EnrollmentFormDialog>
      </div>
    </motion.div>
  );
}
