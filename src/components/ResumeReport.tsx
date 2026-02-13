import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    CheckCircle2,
    XCircle,
    AlertTriangle,
    TrendingUp,
    FileSearch,
    Target,
    Lightbulb,
    X,
    BarChart3,
} from "lucide-react";
import { ResumeAnalysis } from "@/services/geminiService";

interface ResumeReportProps {
    analysis: ResumeAnalysis;
    onClose: () => void;
}

const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    if (score >= 40) return "text-orange-400";
    return "text-red-400";
};

const getScoreGradient = (score: number) => {
    if (score >= 80) return "from-green-500 to-emerald-500";
    if (score >= 60) return "from-yellow-500 to-amber-500";
    if (score >= 40) return "from-orange-500 to-amber-500";
    return "from-red-500 to-rose-500";
};

const getVerdictBg = (score: number) => {
    if (score >= 80) return "bg-green-500/10 border-green-500/20";
    if (score >= 60) return "bg-yellow-500/10 border-yellow-500/20";
    if (score >= 40) return "bg-orange-500/10 border-orange-500/20";
    return "bg-red-500/10 border-red-500/20";
};

const ResumeReport = ({ analysis, onClose }: ResumeReportProps) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0f1019] border border-white/10 shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 z-10 bg-[#0f1019]/95 backdrop-blur-md border-b border-white/10 p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-purple-500/20 rounded-xl">
                            <FileSearch className="h-6 w-6 text-purple-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Resume Analysis Report</h2>
                            <p className="text-slate-400 text-sm">ATS Compatibility & Gap Analysis</p>
                        </div>
                    </div>
                    <Button
                        onClick={onClose}
                        variant="ghost"
                        size="icon"
                        className="text-slate-400 hover:text-white hover:bg-white/10 rounded-xl"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Score Card */}
                    <div className={`rounded-xl border p-6 ${getVerdictBg(analysis.matchScore)}`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Match Score</p>
                                <div className="flex items-baseline gap-2">
                                    <span className={`text-5xl font-bold ${getScoreColor(analysis.matchScore)}`}>
                                        {analysis.matchScore}
                                    </span>
                                    <span className="text-slate-500 text-xl">/100</span>
                                </div>
                                <p className={`text-sm font-semibold mt-2 ${getScoreColor(analysis.matchScore)}`}>
                                    {analysis.verdict}
                                </p>
                            </div>
                            <div className="w-24 h-24 relative">
                                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/5" />
                                    <circle
                                        cx="50" cy="50" r="40" fill="none"
                                        strokeWidth="8"
                                        strokeLinecap="round"
                                        strokeDasharray={`${analysis.matchScore * 2.51} 251`}
                                        className={getScoreColor(analysis.matchScore)}
                                        stroke="currentColor"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <BarChart3 className={`h-8 w-8 ${getScoreColor(analysis.matchScore)}`} />
                                </div>
                            </div>
                        </div>
                        <p className="text-slate-300 text-sm mt-4 leading-relaxed">{analysis.summary}</p>
                    </div>

                    {/* Skills Grid */}
                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Matching Skills */}
                        <Card className="glass-card border-green-500/10">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-semibold text-green-400 flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Matching Skills ({analysis.matchingSkills.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {analysis.matchingSkills.map((skill, i) => (
                                        <Badge key={i} variant="outline" className="border-green-500/30 text-green-300 bg-green-500/5 text-xs">
                                            ✓ {skill}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Missing Skills */}
                        <Card className="glass-card border-red-500/10">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-semibold text-red-400 flex items-center gap-2">
                                    <XCircle className="h-4 w-4" />
                                    Missing Skills ({analysis.missingSkills.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {analysis.missingSkills.map((skill, i) => (
                                        <Badge key={i} variant="outline" className="border-red-500/30 text-red-300 bg-red-500/5 text-xs">
                                            ✗ {skill}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Keywords Analysis */}
                    <Card className="glass-card border-blue-500/10">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-semibold text-blue-400 flex items-center gap-2">
                                <Target className="h-4 w-4" />
                                ATS Keyword Analysis
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-xs text-slate-400 uppercase tracking-wider mb-2 font-medium">Found in Resume</p>
                                <div className="flex flex-wrap gap-2">
                                    {analysis.keywordAnalysis.found.map((kw, i) => (
                                        <Badge key={i} className="bg-blue-500/10 text-blue-300 border border-blue-500/20 text-xs">
                                            {kw}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 uppercase tracking-wider mb-2 font-medium">Missing Keywords</p>
                                <div className="flex flex-wrap gap-2">
                                    {analysis.keywordAnalysis.missing.map((kw, i) => (
                                        <Badge key={i} variant="outline" className="border-orange-500/30 text-orange-300 bg-orange-500/5 text-xs">
                                            + {kw}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Experience Gaps */}
                    {analysis.experienceGaps.length > 0 && (
                        <Card className="glass-card border-orange-500/10">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-semibold text-orange-400 flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4" />
                                    Experience Gaps
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {analysis.experienceGaps.map((gap, i) => (
                                        <li key={i} className="text-slate-300 text-sm flex items-start gap-2">
                                            <span className="h-1.5 w-1.5 rounded-full bg-orange-400 mt-2 flex-shrink-0" />
                                            {gap}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    )}

                    {/* Strengths */}
                    <Card className="glass-card border-emerald-500/10">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-semibold text-emerald-400 flex items-center gap-2">
                                <TrendingUp className="h-4 w-4" />
                                Your Strengths
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {analysis.strengths.map((strength, i) => (
                                    <li key={i} className="text-slate-300 text-sm flex items-start gap-2">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                                        {strength}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Recommendations */}
                    <Card className="glass-card border-purple-500/10">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-semibold text-purple-400 flex items-center gap-2">
                                <Lightbulb className="h-4 w-4" />
                                Recommendations to Improve
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {analysis.recommendations.map((rec, i) => (
                                    <li key={i} className="text-slate-300 text-sm flex items-start gap-3 p-3 rounded-lg bg-purple-500/5 border border-purple-500/10">
                                        <span className="text-purple-400 font-bold text-xs mt-0.5">{i + 1}.</span>
                                        {rec}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ResumeReport;
