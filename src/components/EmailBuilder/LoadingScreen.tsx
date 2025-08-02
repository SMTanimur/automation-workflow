import { Mail, Sparkles, Zap } from "lucide-react";

export const LoadingScreen = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-email-builder-bg via-background to-email-builder-accent-light">
      <div className="text-center space-y-8 animate-fade-in">
        {/* Logo Animation */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-primary rounded-full blur-xl opacity-30 animate-pulse-soft"></div>
          <div className="relative p-8 rounded-full bg-gradient-primary shadow-2xl animate-bounce-soft">
            <Mail className="h-12 w-12 text-primary-foreground" />
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Email Craftsmen
          </h1>
          <p className="text-lg text-muted-foreground">
            Initializing your creative workspace...
          </p>
        </div>

        {/* Loading Animation */}
        <div className="flex items-center justify-center gap-3">
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <div 
                key={i}
                className="h-2 w-2 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-2xl">
          {[
            { icon: Sparkles, title: "Drag & Drop", desc: "Visual editor" },
            { icon: Zap, title: "Responsive", desc: "Mobile-ready" },
            { icon: Mail, title: "Export", desc: "HTML ready" }
          ].map((feature, i) => (
            <div 
              key={i}
              className="p-6 rounded-xl bg-email-builder-sidebar/50 backdrop-blur-sm border border-border/50 animate-fade-in"
              style={{ animationDelay: `${i * 0.3}s` }}
            >
              <feature.icon className="h-8 w-8 text-primary mb-3 mx-auto" />
              <h3 className="font-semibold text-sm">{feature.title}</h3>
              <p className="text-xs text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};