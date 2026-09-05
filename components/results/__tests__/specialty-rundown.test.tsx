import { render, screen } from "@testing-library/react";
import { SpecialtyRundown } from "@/components/results/specialty-rundown";
import { MatchResult, SpecialtyProfile } from "@/lib/types";

const specialty: SpecialtyProfile = {
  id: "test-specialty",
  name: "Test Specialty",
  category: "medical",
  description: "A test specialty.",
  traitProfile: {
    patientInteraction: 50,
    proceduralInterest: 50,
    diagnosticReasoning: 50,
    fastPacedPreference: 50,
    workLifePriority: 50,
    emotionalResilience: 50,
    teamCollaboration: 50,
    precisionOrientation: 50,
    longTermRelationships: 50,
    researchCuriosity: 50,
    leadershipPreference: 50,
    trainingTolerance: 50,
    emergencyComfort: 50,
    communicationEmpathy: 50,
    predictableSchedulePreference: 50
  },
  requiredTraits: [],
  workEnvironment: "Test environment.",
  lifestyleRating: 3,
  competitiveness: 4,
  burnoutRisk: 3,
  salaryRangeGhs: [8500, 28000],
  salaryDisclaimer: "Indicative monthly income range in Ghana; varies by level and setting.",
  trainingLength: "Housemanship plus residency, often 4-6 years.",
  emergencyIntensity: 3,
  patientInteractionLevel: 5,
  procedureIntensity: 2,
  ghanaOpportunities: [],
  ghanaResidencyPathway: "Commonly begins after housemanship through Ghana College routes.",
  relatedSpecialties: [],
  dayInLife: [],
  pros: [],
  cons: [],
  futureTrends: []
};

const match: MatchResult = {
  specialtyId: "test-specialty",
  score: 0.92,
  matchPercentage: 92,
  confidenceLevel: "Medium",
  strengths: ["Diagnostic Reasoning"],
  challenges: ["Procedural Interest"],
  explanationFactors: { alignedTraits: ["Diagnostic Reasoning"], stretchTraits: ["Procedural Interest"] },
  reasoning: "A strong exploratory fit."
};

describe("SpecialtyRundown", () => {
  it("renders the four labelled rows", () => {
    render(<SpecialtyRundown match={match} specialty={specialty} />);

    expect(screen.getByText("Training")).toBeInTheDocument();
    expect(screen.getByText("Pathway in Ghana")).toBeInTheDocument();
    expect(screen.getByText("Difficulty")).toBeInTheDocument();
    expect(screen.getByText("Expected pay in Ghana")).toBeInTheDocument();
  });

  it("formats the salary range in GHS with the disclaimer", () => {
    render(<SpecialtyRundown match={match} specialty={specialty} />);

    expect(screen.getByText("GH₵ 8,500 – 28,000 / month")).toBeInTheDocument();
    expect(screen.getByText(specialty.salaryDisclaimer)).toBeInTheDocument();
  });

  it("shows the difficulty word for a competitiveness-4 specialty", () => {
    render(<SpecialtyRundown match={match} specialty={specialty} />);

    expect(screen.getByText("High competitiveness")).toBeInTheDocument();
  });
});
