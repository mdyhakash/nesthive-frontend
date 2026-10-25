import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background text-foreground">
      <Card className="max-w-md w-full text-center shadow-lg border-border">
        <CardHeader>
          <div className="flex justify-center mb-2">
            <Badge tone="amber">
              NestHive Design System
            </Badge>
          </div>
          <CardTitle className="text-2xl font-bold">Find your room. Find your people.</CardTitle>
          <CardDescription>
            Core design system, typography, and base UI primitives initialized.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button variant="default">Hive Amber Button</Button>
          <Button variant="secondary">Deep Teal Button</Button>
          <Button variant="soft">Soft Variant</Button>
        </CardContent>
      </Card>
    </main>
  );
}
