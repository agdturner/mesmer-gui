import {
    arrayToString,
    mapToString
} from './functions.js';

/**
 * A class for representing an atom.
 * @param {string} id The id of the atom.
 * @param {string} elementType The element type of the atom.
 */
export class Atom {
    id: string;
    elementType: string;
    constructor(id: string, elementType: string) {
        this.id = id;
        this.elementType = elementType;
    }
    toString() {
        return `Atom(` +
            `id(${this.id}), ` +
            `elementType(${this.elementType}))`;
    }
}

/**
 * A class for representing an atomic bond - a bond beteen two atoms.
 * @param {Atom} atomA One atom.
 * @param {Atom} atomB Another atom.
 * @param {string} order The order of the bond.
 */
export class Bond {
    atomA: Atom;
    atomB: Atom;
    order: string;
    constructor(atomA: Atom, atomB: Atom, order: string) {
        this.atomA = atomA;
        this.atomB = atomB;
        this.order = order;
    }
    toString() {
        return `Bond(` +
            `atomA(${this.atomA.toString()}), ` +
            `atomB(${this.atomA.toString()}), ` +
            `order(${this.order}))`;
    }
}

/**
 * A class for representing a measure.
 * @param {number} value The value of the measure.
 * @param {string} units The units of the measure.
 */
class Measure {
    value: number;
    units: string;
    constructor(value: number, units: string) {
        this.value = value;
        this.units = units;
    }
    toString() {
        return `Measure(` +
            `value(${this.value.toString()}), ` +
            `units(${this.units}))`;
    }
}

/**
 * A class for representing a property scalar.
 * @param {number} value The value.
 * @param {string} units The units.
 */
export class PropertyScalar extends Measure {
    constructor(value: number, units: string) {
        super(value, units);
    }
    toString() {
        return `Scalar(${super.toString()})`;
    }
}

/**
 * A class for representing a property array.
 * @param {number[]} values The values.
 * @param {string} unit The unit.
 */
export class PropertyArray {
    values: number[];
    units: string;
    constructor(values: number[], units: string) {
        this.values = values;
        this.units = units;
    }
    toString() {
        return `PropertyArray(` +
            `values(${arrayToString(this.values)}), ` +
            `unit(${this.units}))`;
    }
    toPropertyScalarArray() {
        let r: PropertyScalar[] = [];
        for (let i = 0; i < this.values.length; i++) {
            r.push(new PropertyScalar(this.values[i], this.units));
        }
        return r;
    }
}

/**
 * A class for representing a molecule.
 * @param {string} id The id of the molecule.
 * @param {string} description The description of the molecule.
 * @param {boolean} active Indicates if the molecule is active.
 * @param {Map<string, Atom>} atoms A Map of atoms with keys as string atom ids and values as Atoms.
 * @param {Map<string, Bond>} bonds A Map of bonds with keys as string atom ids and values as Bonds.
 * @param {Map<string, PropertyScalar | PropertyArray>} properties A map of properties.
 * @param {string} dOSCMethod The principal external rotational states method for calculating density of states.
 */
export class Molecule {
    id: string;
    description: string;
    active: boolean;
    atoms: Map<string, Atom>;
    bonds: Map<string, Bond>;
    properties: Map<string, PropertyScalar | PropertyArray>;
    dOSCMethod: string;
    constructor(id: string, description: string, active: boolean,
        atoms: Map<string, Atom>,
        bonds: Map<string, Bond>,
        properties: Map<string, PropertyScalar | PropertyArray>,
        dOSCMethod: string) {
        this.id = id;
        this.description = description;
        this.active = active;
        this.atoms = atoms;
        this.bonds = bonds;
        this.properties = properties;
        this.dOSCMethod = dOSCMethod;
    }
    toString() {
        return `Molecule(` +
            `id(${this.id}), ` +
            `description(${this.description}), ` +
            `active(${this.active.toString()}), ` +
            `atoms(${mapToString(this.atoms)}), ` +
            `bonds(${mapToString(this.bonds)}), ` +
            `properties(${mapToString(this.properties)}), ` +
            `dOSCMethod(${this.dOSCMethod.toString()}))`;
    }
    getEnergy(): number {
        let energy: number;
        let energyProperty = this.properties.get('me:ZPE');
        if (energyProperty != null) {
            if (energyProperty instanceof PropertyScalar) {
                energy = energyProperty.value;
            }
        }
        return energy
    }
    getRotationConstants(): number[] {
        let rotationConstants: number[];
        let rotationConstantsProperty = this.properties.get('me:rotConsts');
        if (rotationConstantsProperty != null) {
            if (rotationConstantsProperty instanceof PropertyScalar) {
                rotationConstants = [rotationConstantsProperty.value];
            } else {
                rotationConstants = rotationConstantsProperty.values;
            }
        }
        return rotationConstants;
    }
    getVibrationFrequencies(): number[] {
        let vibrationFrequencies: number[];
        let vibrationFrequenciesProperty = this.properties.get('me:vibFreqs');
        if (vibrationFrequenciesProperty != null) {
            if (vibrationFrequenciesProperty instanceof PropertyScalar) {
                vibrationFrequencies = [vibrationFrequenciesProperty.value];
            } else {
                vibrationFrequencies = vibrationFrequenciesProperty.values;
            }
        }
        return vibrationFrequencies;
    }
}

/**
 * A class for representing a molecule and a role.
 * @param {Molecule} molecule The molecule.
 * @param {string} role The role of the molecule.
 */
class MR {
    molecule: Molecule;
    role: string;
    constructor(molecule: Molecule, role: string) {
        this.molecule = molecule;
        this.role = role;
    }
    toString() {
        return `MR(` +
            `molecule(${this.molecule.toString()}), ` +
            `role(${this.role}))`;
    }
}

/**
 * A class for representing a reactant in a reaction.
 * @param {Molecule} molecule The molecule.
 * @param {string} role The role of the molecule.
 */
export class Reactant extends MR {
    constructor(molecule: Molecule, role: string) {
        super(molecule, role);
    }
    toString() {
        return `Reactant(${super.toString})`;
    }
}

/**
 * A class for representing a product in a reaction.
 * @param {Molecule} molecule The molecule.
 * @param {string} role The role of the molecule.
 */
export class Product extends MR {
    constructor(molecule: Molecule, role: string) {
        super(molecule, role);
    }
    toString() {
        return `Product(${super.toString})`;
    }
}

/**
 * A class for representing a transition state.
 * @param {Molecule} molecule The molecule.
 * @param {string} role The role of the molecule.
 */
export class TransitionState extends MR {
    constructor(molecule: Molecule, role: string) {
        super(molecule, role);
    }
    toString() {
        return `TransitionState(${super.toString})`;
    }
}

/**
 * A class for representing MCRCTypes - microcanonical rate constant types.
 * @param {string} type The type of the microcanonical rate constant.
 */
export class MCRCType {
    type: string;
    constructor(type: string) {
        this.type = type;
    }
    toString() {
        return `MCRCType(` +
            `type(${this.type}))`;
    }
}

/**
 * A class for representing a Bounded Stepped Measure.
 * @param {number} value The value of the factor.
 * @param {string} units The units.
 * @param {number} lower The lower bound.
 * @param {number} upper The upper bound.
 * @param {number} stepsize The stepsize.
 */
class BSMeaure extends Measure {
    lower: number;
    upper: number;
    stepsize: number;
    constructor(value: number, units: string, lower: number, upper: number, stepsize: number) {
        super(value, units);
        this.lower = lower;
        this.upper = upper;
        this.stepsize = stepsize;
    }
    toString() {
        return `BSMeaure(${super.toString}, ` +
            `lower(${this.lower.toString()}), ` +
            `upper(${this.upper.toString()}), ` +
            `stepsize(${this.stepsize.toString()}))`;
    }
}

/**
 * A class for representing the Arrhenius pre-exponential factor. 
 * @param {number} value The value of the factor.
 * @param {string} units The units.
 * @param {number} lower The lower bound.
 * @param {number} upper The upper bound.
 * @param {number} stepsize The stepsize.
 */
export class PreExponential extends BSMeaure {
    constructor(value: number, units: string, lower: number, upper: number, stepsize: number) {
        super(value, units, lower, upper, stepsize);
    }
    toString() {
        return `PreExponential(${super.toString})`;
    }
}

/**
 * A class for representing the Arrhenius activation energy factor.
 * @param {number} value The value of the factor.
 * @param {string} units The units.
 */
export class ActivationEnergy extends Measure {
    constructor(value: number, units: string) {
        super(value, units);
    }
    toString() {
        return `ActivationEnergy(${super.toString()})`;
    }
}

/**
 * A class for representing the modified Arrhenius parameter factor. 
 * @param {number} value The value of the factor.
 * @param {string} units The units.
 * @param {number} lower The lower bound.
 * @param {number} upper The upper bound.
 * @param {number} stepsize The stepsize.
 */
export class NInfinity extends BSMeaure {
    constructor(value: number, units: string, lower: number, upper: number, stepsize: number) {
        super(value, units, lower, upper, stepsize);
    }
    toString() {
        return `NInfinity(${super.toString})`;
    }
}

/**
 * A class for representing the inverse Laplace transform (ILT) type of microcanonical rate constant.
 * @param {string} type The type of the microcanonical rate constant.
 * @param {PreExponential} preExponential The pre-exponential factor.
 * @param {ActivationEnergy} activationEnergy The activation energy.
 * @param {number} TInfinity The TInfinity.
 * @param {NInfinity} nInfinity The nInfinity.
 */
export class MesmerILT extends MCRCType {
    preExponential: PreExponential;
    activationEnergy: ActivationEnergy;
    TInfinity: number;
    nInfinity: NInfinity;
    constructor(type: string, preExponential: PreExponential, activationEnergy: ActivationEnergy, TInfinity: number,
        nInfinity: NInfinity) {
        super(type);
        this.preExponential = preExponential;
        this.activationEnergy = activationEnergy;
        this.TInfinity = TInfinity;
        this.nInfinity = nInfinity;
    }
    toString() {
        return `MesmerILT(${super.toString()}, ` +
            `preExponential(${this.preExponential.toString()}), ` +
            `activationEnergy(${this.activationEnergy.toString()}), ` +
            `TInfinity(${this.TInfinity.toString()}), ` +
            `nInfinity(${this.nInfinity.toString()}))`;
    }
}

/**
 * A class for representing the MCRCMethod specifications.
 * Extended classes indicate how microcanonical rate constant is to be treated.
 * @param {string} name The name of the method.
 * @param {string} type The type of the microcanonical rate constant.
 */
export class MCRCMethod {
    name: string;
    type: string;
    constructor(name: string, type: string) {
        this.name = name;
        this.type = type;
    }
    toString() {
        return `MCRCMethod(` +
            `name(${this.name}), ` +
            `type(${this.type}))`;
    }
}

/**
 * A class for representing the Zhu-Nakamura crossing MCRCMethod.
 * @param {string} name The name of the method.
 * @param {string} type The type of the method.
 * @param {number} harmonicReactantDiabat_FC The harmonic reactant diabatic FC.
 * @param {number} harmonicReactantDiabat_XO The harmonic reactant diabatic XO.
 * @param {number} harmonicProductDiabat_DE The harmonic product diabatic DE.
 * @param {number} exponentialProductDiabat_A The exponential product diabatic A.
 * @param {number} exponentialProductDiabat_B The exponential product diabatic B.
 * @param {number} exponentialProductDiabat_DE The exponential product diabatic DE.
 */
export class ZhuNakamuraCrossing extends MCRCMethod {
    harmonicReactantDiabat_FC: number;
    harmonicReactantDiabat_XO: number;
    harmonicProductDiabat_DE: number;
    exponentialProductDiabat_A: number;
    exponentialProductDiabat_B: number;
    exponentialProductDiabat_DE: number;
    constructor(name: string, type: string,
        harmonicReactantDiabat_FC: number,
        harmonicReactantDiabat_XO: number,
        harmonicProductDiabat_DE: number,
        exponentialProductDiabat_A: number,
        exponentialProductDiabat_B: number,
        exponentialProductDiabat_DE: number) {
        super(name, type);
        this.harmonicReactantDiabat_FC = harmonicReactantDiabat_FC;
        this.harmonicReactantDiabat_XO = harmonicReactantDiabat_XO;
        this.harmonicProductDiabat_DE = harmonicProductDiabat_DE;
        this.exponentialProductDiabat_A = exponentialProductDiabat_A;
        this.exponentialProductDiabat_B = exponentialProductDiabat_B;
        this.exponentialProductDiabat_DE = exponentialProductDiabat_DE;
    }
    toString() {
        return `ZhuNakamuraCrossing(${super.toString}, ` +
            `name(${this.name}), ` +
            `harmonicReactantDiabat_FC(${this.harmonicReactantDiabat_FC.toString()}), ` +
            `harmonicReactantDiabat_XO(${this.harmonicReactantDiabat_XO.toString()}), ` +
            `harmonicProductDiabat_DE(${this.harmonicProductDiabat_DE.toString()}), ` +
            `exponentialProductDiabat_A(${this.exponentialProductDiabat_A.toString()}), ` +
            `exponentialProductDiabat_B(${this.exponentialProductDiabat_B.toString()}), ` +
            `exponentialProductDiabat_DE(${this.exponentialProductDiabat_DE.toString()}))`;
    }
}

/**
 * A class for representing the sum of states.
 * @param {string} units The units of energy.
 * @param {boolean} angularMomentum The angular momentum attribute.
 * @param {boolean} noLogSpline The no log spline attribute.
 * @param {SumOfStatesPoint[]} sumOfStatesPoints The sum of states points.
 */
export class SumOfStates {
    units: string;
    angularMomentum: boolean;
    noLogSpline: boolean;
    sumOfStatesPoints: SumOfStatesPoint[];
    constructor(units: string, angularMomentum: boolean, noLogSpline: boolean, sumOfStatesPoints: SumOfStatesPoint[]) {
        this.units = units;
        this.angularMomentum = angularMomentum;
        this.noLogSpline = noLogSpline;
        this.sumOfStatesPoints = sumOfStatesPoints;
    }
    toString() {
        return `SumOfStates(` +
            `units(${this.units}), ` +
            `angularMomentum(${this.angularMomentum.toString()}), ` +
            `noLogSpline(${this.noLogSpline.toString()}), ` +
            `sumOfStatesPoints(${arrayToString(this.sumOfStatesPoints)}))`;
    }
}

/**
 * A class for representing a sum of states point.
 * @param {number} value The value of the point.
 * @param {number} energy The energy of the point.
 * @param {number} angMomMag The angular momentum magnitude of the point.
 */
export class SumOfStatesPoint {
    value: number;
    energy: number;
    angMomMag: number;
    constructor(value: number, energy: number, angMomMag: number) {
        this.value = value;
        this.energy = energy;
        this.angMomMag = angMomMag;
    }
    toString() {
        return `SumOfStatesPoint(` +
            `value(${this.value}), ` +
            `energy(${this.energy.toString()}), ` +
            `angMomMag(${this.angMomMag.toString()}))`;
    }
}

/**
 * A class for representing the DefinedSumOfStates MCRCMethod.
 * @param {string} name The name of the method. 
 * @param {string} type The type of the method.
 * @param {SumOfStates} sumOfStates The sum of states.
 */
export class DefinedSumOfStates extends MCRCMethod {
    sumOfStates: SumOfStates;
    constructor(name: string, type: string, sumOfStates: SumOfStates) {
        super(name, type);
        this.sumOfStates = sumOfStates;
    }
    toString() {
        return `DefinedSumOfStates(${super.toString}, ` +
            `sumOfStates(${this.sumOfStates.toString()}))`;
    }
}

/**
 * A class for representing a reaction.
 * @param {string} id The id of the reaction.
 * @param {boolean} active Indicates if the reaction is active.
 * @param {Reactant[]} reactants The reactants in the reaction.
 * @param {Product[]} products The products of the reaction.
 */
export class Reaction {
    id: string;
    active: boolean;
    reactants: Map<string, Reactant>;
    products: Map<string, Product>;
    constructor(id: string, active: boolean, reactants: Map<string, Reactant>, products: Map<string, Product>) {
        this.id = id;
        this.active = active;
        this.reactants = reactants;
        this.products = products;
    }
    toString() {
        return `Reaction(` +
            `id(${this.id}), ` +
            `active(${this.active.toString()}), ` +
            `reactants(${mapToString(this.reactants)}), ` +
            `products(${mapToString(this.products)}))`;
    }
}

/**
 * A class for representing a reaction.
 * @param {string} id The id of the reaction.
 * @param {boolean} active Indicates if the reaction is active.
 * @param {Map<string, Reactant>} reactants The reactants in the reaction.
 * @param {Map<string, Product>} products The products of the reaction.
 * @param {MCRCMethod} mCRCMethod The MCRCMethod.
 * @param {TransitionState} transitionState The transition state.
 */
export class ReactionWithTransitionState extends Reaction {
    mCRCMethod: MCRCMethod;
    transitionState: TransitionState;
    constructor(id: string, active: boolean, reactants: Map<string, Reactant>, products: Map<string, Product>,
        mCRCMethod: MCRCMethod, transitionState: TransitionState) {
        super(id, active, reactants, products);
        this.mCRCMethod = mCRCMethod;
        this.transitionState = transitionState;
    }
    toString() {
        return `ReactionWithTransitionState(${super.toString}, ` +
            `mCRCMethod(${this.mCRCMethod.toString()}), ` +
            `transitionState(${this.transitionState.toString()}))`;
    }
}

/**
 * A class for representing a Pressure and Temperature pair.
 * @param {string} units The units of the pair.
 * @param {number} P The pressure.
 * @param {number} T The temperature.
 */
export class PTpair {
    units: string;
    P: number;
    T: number;
    constructor(units: string, P: number, T: number) {
        this.units = units;
        this.P = P;
        this.T = T;
    }
    toString() {
        return `PTpair(` +
            `units(${this.units}), ` +
            `P(${this.P.toString()}), ` +
            `T(${this.T.toString()}))`;
    }
}

/**
 * A class for representing the experiment conditions.
 * @param {string} bathGas The bath gas.
 * @param {PTpair[]} pTs The Pressure and Temperature pairs.
 */
export class Conditions {
    bathGas: string;
    pTs: PTpair[];
    constructor(bathGas: string, pTs: PTpair[]) {
        this.bathGas = bathGas;
        this.pTs = pTs;
    }
    toString() {
        return `Conditions(` +
            `bathGas(${this.bathGas}), ` +
            `pTs(${this.pTs.toString()}))`;
    }
}

/**
 * A class for measures of grain size.
 * @param {number} value The value.
 * @param {string} units The units.
 */
export class GrainSize extends Measure {
    constructor(value: number, units: string) {
        super(value, units);
    }
    toString() {
        return `GrainSize(${super.toString()})`;
    }
}

/**
 * A class for model parameters.
 * @param {GrainSize} grainSize The grain size.
 * @param {number} energyAboveTheTopHill The energy above the top hill.
 */
export class ModelParameters {
    grainSize: GrainSize;
    energyAboveTheTopHill: number;
    constructor(grainSize: GrainSize, energyAboveTheTopHill: number) {
        this.grainSize = grainSize;
        this.energyAboveTheTopHill = energyAboveTheTopHill;
    }
    toString() {
        return `ModelParameters(` +
            `grainSize(${this.grainSize.toString()}), ` +
            `energyAboveTheTopHill(${this.energyAboveTheTopHill.toString()}))`;
    }
}

/**
 * A class for the diagram energy offset.
 * @param {string} ref The reference.
 * @param {number} value The value.
 */
export class DiagramEnergyOffset {
    ref: string;
    value: number;
    constructor(ref: string, value: number) {
        this.ref = ref;
        this.value = value;
    }
    toString() {
        return `DiagramEnergyOffset(` +
            `ref(${this.ref}), ` +
            `value(${this.value.toString()}))`;
    }
}

/**
 * A class for the control.
 * @param {boolean} testDOS The test density of states flag.
 * @param {boolean} printSpeciesProfile The print species profile flag.
 * @param {boolean} testMicroRates The test micro rates flag.
 * @param {boolean} testRateConstant The test rate constant flag.
 * @param {boolean} printGrainDOS The print grain density of states flag.
 * @param {boolean} printCellDOS The print cell density of states flag.
 * @param {boolean} printReactionOperatorColumnSums The print reaction operator column sums flag.
 * @param {boolean} printTunnellingCoefficients The print tunnelling coefficients flag.
 * @param {boolean} printGrainkfE The print grain kfE flag.
 * @param {boolean} printGrainBoltzmann The print grain Boltzmann flag.
 * @param {boolean} printGrainkbE The print grain kbE flag.
 * @param {number} eigenvalues The number of eigenvalues.
 * @param {boolean} hideInactive The hide inactive flag.
 * @param {DiagramEnergyOffset} diagramEnergyOffset The diagram energy offset.
 */
export class Control {
    testDOS: boolean;
    printSpeciesProfile: boolean;
    testMicroRates: boolean;
    testRateConstant: boolean;
    printGrainDOS: boolean;
    printCellDOS: boolean;
    printReactionOperatorColumnSums: boolean;
    printTunnellingCoefficients: boolean;
    printGrainkfE: boolean;
    printGrainBoltzmann: boolean;
    printGrainkbE: boolean;
    eigenvalues: number;
    hideInactive: boolean;
    diagramEnergyOffset: DiagramEnergyOffset;
    constructor(testDOS: boolean, printSpeciesProfile: boolean, testMicroRates: boolean, testRateConstant:
        boolean, printGrainDOS: boolean, printCellDOS: boolean, printReactionOperatorColumnSums:
            boolean, printTunnellingCoefficients: boolean, printGrainkfE: boolean, printGrainBoltzmann: boolean,
        printGrainkbE: boolean, eigenvalues: number, hideInactive: boolean, diagramEnergyOffset: DiagramEnergyOffset) {
        this.testDOS = testDOS;
        this.printSpeciesProfile = printSpeciesProfile;
        this.testMicroRates = testMicroRates;
        this.testRateConstant = testRateConstant;
        this.printGrainDOS = printGrainDOS;
        this.printCellDOS = printCellDOS;
        this.printReactionOperatorColumnSums = printReactionOperatorColumnSums;
        this.printTunnellingCoefficients = printTunnellingCoefficients;
        this.printGrainkfE = printGrainkfE;
        this.printGrainBoltzmann = printGrainBoltzmann;
        this.printGrainkbE = printGrainkbE;
        this.eigenvalues = eigenvalues;
        this.hideInactive = hideInactive;
        this.diagramEnergyOffset = diagramEnergyOffset;
    }
    toString() {
        return `Control(` +
            `testDOS(${this.testDOS.toString()}), ` +
            `printSpeciesProfile(${this.printSpeciesProfile.toString()}), ` +
            `testMicroRates(${this.testMicroRates.toString()}), ` +
            `testRateConstant(${this.testRateConstant.toString()}), ` +
            `printGrainDOS(${this.printGrainDOS.toString()}), ` +
            `printCellDOS(${this.printCellDOS.toString()}), ` +
            `printReactionOperatorColumnSums(${this.printReactionOperatorColumnSums.toString()}), ` +
            `printTunnellingCoefficients(${this.printTunnellingCoefficients.toString()}), ` +
            `printGrainkfE(${this.printGrainkfE.toString()}), ` +
            `printGrainBoltzmann(${this.printGrainBoltzmann.toString()}), ` +
            `printGrainkbE(${this.printGrainkbE.toString()}), ` +
            `eigenvalues(${this.eigenvalues.toString()}), ` +
            `hideInactive(${this.hideInactive.toString()}))`;
    }
}