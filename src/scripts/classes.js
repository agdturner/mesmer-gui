/**
 * A class for representing an atom.
 * @param {String} id The id of the atom.
 * @param {String} elementType The element type of the atom.
 */
class Atom {
    constructor(id, elementType) {
        this.id = id;
        this.elementType = elementType;
    }
    toString() {
        return `Atom(
        id(${this.id}),
        elementType(${this.elementType}))`;
    }
}

/**
 * A class for representing an atomic bond - a bond beteen two atoms.
 * @param {Atom} atomA One atom.
 * @param {Atom} atomB Another atom.
 * @param {String} order The order of the bond.
 */
class Bond {
    constructor(atomA, atomB, order) {
        this.atomA = atomA;
        this.atomB = atomB;
        this.order = order;
    }
    toString() {
        return `Bond(
        atomA(${this.atomA.toString()}),
        atomB(${this.atomA.toString()}),
        order(${this.order}))`;
    }
}

/**
 * A class for representing a measure.
 * @param {Number} value The value of the measure.
 * @param {String} units The units of the measure.
 */
class Measure {
    constructor(value, units) {
        this.value = value;
        this.units = units;
    }
    toString() {
        return `Measure(
        value(${this.value.toString()}),
        units(${this.units})`;
    }
}

/**
 * A class for representing a property scalar.
 * @param {Number} value The value.
 * @param {String} units The units.
 */
class PropertyScalar extends Measure {
    constructor(value, units) {
        super(value, units);
    }
    toString() {
        return `Scalar(${super.toString})`;
    }
}

/**
 * A class for representing a property array.
 * @param {Number[]} values The values.
 * @param {String} unit The unit.
 */
class PropertyArray {
    constructor(values, unit) {
        super(values, unit);
    }
    toString() {
        return `PropertyArray(
            values(${values.toString}),
            unit(${values.toString}))`;
    }
}

/**
 * A class for representing a molecule.
 * @param {String} id The id of the molecule.
 * @param {String} description The description of the molecule.
 * @param {Boolean} active Indicates if the molecule is active.
 * @param {Atom[]} atomArray An array of atoms.
 * @param {Bond[]} bondArray An array of bonds.
 * @param {Map} properties A map of properties with keys as {String} dictRef and values as {Measure} scalar or {Measure[]} arrays.
 * @param {String} DOSCMethod The principal external rotational states method for calculating density of states.
 */
class Molecule {
    constructor(id, description, active, atomArray, bondArray, properties, DOSCMethod) {
        this.id = id;
        this.description = description;
        this.active = active;
        this.atomArray = atomArray;
        this.bondArray = bondArray;
        this.properties = properties;
        this.DOSCMethod = DOSCMethod;
    }
    toString() {
        return `Molecule(
        id(${this.id}), 
        description(${this.description}), 
        atomArray(${this.atomArray.toString()}), 
        bondArray(${this.bondArray.toString()}), 
        properties(${this.properties.toString()}), 
        DOSCMethod(${this.DOSCMethod.toString()}))`;
    }
}

/**
 * A class for representing a reactant in a reaction.
 * @param {Molecule} molecule The molecule.
 * @param {String} role The role of the molecule.
 */
class Reactant {
    constructor(molecule, role) {
        this.molecule = molecule;
        this.role = role;
    }
    toString() {
        return `Reactant(
        molecule(${this.molecule.toString()}), 
        role(${this.role}))`;
    }
}

/**
 * A class for representing a product in a reaction.
 * @param {Molecule} molecule The molecule.
 * @param {String} role The role of the molecule.
 */
class Product {
    constructor(molecule, role) {
        this.molecule = molecule;
        this.role = role;
    }
    toString() {
        return `Product(
        molecule(${this.molecule.toString()}), 
        role(${this.role}))`;
    }
}

/**
 * A class for representing a transition state.
 * @param {Molecule} molecule The molecule.
 * @param {String} role The role of the molecule.
 */
class TransitionState {
    constructor(molecule, role) {
        this.molecule = molecule;
        this.role = role;
    }
    toString() {
        return `TransitionState(
        molecule(${this.molecule.toString()}), 
        role(${this.role}))`;
    }
}

/**
 * A class for representing MCRCTypes - microcanonical rate constant types.
 * @param {String} type The type of the microcanonical rate constant.
 */
class MCRCType {
    constructor(type) {
        this.type = type;
    }
    toString() {
        return `MCRCType(
        type(${this.type}))`;
    }
}

/**
 * A class for representing the Arrhenius pre-exponential factor. 
 * @param {Number} value The value of the factor.
 * @param {String} units The units.
 * @param {Number} lower The lower bound.
 * @param {Number} upper The upper bound.
 * @param {Number} stepsize The stepsize.
 */
class PreExponential extends Measure {
    constructor(value, units, lower, upper, stepsize) {
        super(value, units);
        this.lower = lower;
        this.upper = upper;
        this.stepsize = stepsize;
    }
    toString() {
        return `PreExponential(${super.toString}, 
        value(${this.value.toString()}),
        units(${this.units}),
        lower(${this.lower.toString()}),
        upper(${this.upper.toString()}),
        stepsize(${this.stepsize.toString()}))`;
    }
}

/**
 * A class for representing the Arrhenius activation energy factor.
 * @param {Number} value The value of the factor.
 * @param {String} units The units.
 */
class ActivationEnergy extends Measure {
    constructor(value, units) {
        super(value, units);
    }
    toString() {
        return `ActivationEnergy(${super.toString()})`;
    }
}

/**
 * A class for representing the modified Arrhenius parameter factor. 
 * @param {Number} value The value of the factor.
 * @param {String} units The units.
 * @param {Number} lower The lower bound.
 * @param {Number} upper The upper bound.
 * @param {Number} stepsize The stepsize.
 */
class NInfinity extends Measure {
    constructor(value, units, lower, upper, stepsize) {
        super(value, units);
        this.lower = lower;
        this.upper = upper;
        this.stepsize = stepsize;
    }
    toString() {
        return `NInfinity(${super.toString},
        lower(${this.lower.toString()}),
        upper(${this.upper.toString()}),
        stepsize(${this.stepsize.toString()}))`;
    }
}

/**
 * A class for representing the inverse Laplace transform (ILT) type of microcanonical rate constant.
 * @param {String} type The type of the microcanonical rate constant.
 * @param {PreExponential} preExponential The pre-exponential factor.
 * @param {ActivationEnergy} activationEnergy The activation energy.
 * @param {Number} TInfinity The TInfinity.
 * @param {NInfinity} nInfinity The nInfinity.
 */
class MesmerILT extends MCRCType {
    constructor(type, preExponential, activationEnergy, TInfinity, nInfinity) {
        super(type);
        this.preExponential = preExponential;
        this.activationEnergy = activationEnergy;
        this.TInfinity = TInfinity;
        this.nInfinity = nInfinity;
    }
    toString() {
        return `MesmerILT(${super.toString()},
        preExponential(${this.preExponential.toString()}),
        activationEnergy(${this.activationEnergy.toString()}),
        TInfinity(${this.TInfinity.toString()}),
        nInfinity(${this.nInfinity.toString()}))`;
    }
}

/**
 * A class for representing the MCRCMethod specifications.
 * Extended classes indicate how microcanonical rate constant is to be treated.
 * @param {String} name The name of the method.
 * @param {String} type The type of the microcanonical rate constant.
 */
class MCRCMethod {
    constructor(name, type) {
        this.name = name;
        this.type = type;
    }
    toString() {
        return `MCRCMethod(
        name(${this.name}),
        type(${this.type}))`;
    }
}

/**
 * A class for representing the Zhu-Nakamura crossing MCRCMethod.
 * @param {String} name The name of the method.
 * @param {String} type The type of the method.
 * @param {Number} harmonicReactantDiabat_FC The harmonic reactant diabatic FC.
 * @param {Number} harmonicReactantDiabat_XO The harmonic reactant diabatic XO.
 * @param {Number} harmonicProductDiabat_DE The harmonic product diabatic DE.
 * @param {Number} exponentialProductDiabat_A The exponential product diabatic A.
 * @param {Number} exponentialProductDiabat_B The exponential product diabatic B.
 * @param {Number} exponentialProductDiabat_DE The exponential product diabatic DE.
 */
class ZhuNakamuraCrossing extends MCRCMethod {
    constructor(name, type, harmonicReactantDiabat_FC, harmonicReactantDiabat_XO,
        harmonicProductDiabat_DE, exponentialProductDiabat_A, exponentialProductDiabat_B,
        exponentialProductDiabat_DE) {
        super(name, type);
        this.harmonicReactantDiabat_FC = harmonicReactantDiabat_FC;
        this.harmonicReactantDiabat_XO = harmonicReactantDiabat_XO;
        this.harmonicProductDiabat_DE = harmonicProductDiabat_DE;
        this.exponentialProductDiabat_A = exponentialProductDiabat_A;
        this.exponentialProductDiabat_B = exponentialProductDiabat_B;
        this.exponentialProductDiabat_DE = exponentialProductDiabat_DE;
    }
    toString() {
        return `ZhuNakamuraCrossing(${super.toString},
        name(${this.name}),
        harmonicReactantDiabat_FC(${this.harmonicReactantDiabat_FC.toString()}),
        harmonicReactantDiabat_XO(${this.harmonicReactantDiabat_XO.toString()}),
        harmonicProductDiabat_DE(${this.harmonicProductDiabat_DE.toString()}),
        exponentialProductDiabat_A(${this.exponentialProductDiabat_A.toString()}),
        exponentialProductDiabat_B(${this.exponentialProductDiabat_B.toString()}),
        exponentialProductDiabat_DE(${this.exponentialProductDiabat_DE.toString()}))`;
    }
}

/**
 * A class for representing the sum of states.
 * @param {String} units The units of energy.
 * @param {Boolean} angularMomentum The angular momentum attribute.
 * @param {Boolean} noLogSpline The no log spline attribute.
 * @param {SumOfStatesPoint[]} sumOfStatesPoints The sum of states points.
 */
class SumOfStates {
    constructor(units, angularMomentum, noLogSpline, sumOfStatesPoints) {
        this.units = units;
        this.angularMomentum = angularMomentum;
        this.noLogSpline = noLogSpline;
        this.sumOfStatesPoints = sumOfStatesPoints;
    }
    toString() {
        return `SumOfStates(
        units(${this.units}),
        angularMomentum(${this.angularMomentum.toString()}),
        noLogSpline(${this.noLogSpline.toString()}),
        sumOfStatesPoints(${this.sumOfStatesPoints.toString()}))`;
    }
}

/**
 * A class for representing a sum of states point.
 * @param {Number} value The value of the point.
 * @param {Number} energy The energy of the point.
 * @param {Number} angMomMag The angular momentum magnitude of the point.
 */
class SumOfStatesPoint {
    constructor(value, energy, angMomMag) {
        this.value = value;
        this.energy = energy;
        this.angMomMag = angMomMag;
    }
    toString() {
        return `SumOfStatesPoint(
        value(${this.value}),
        energy(${this.energy.toString()}),
        angMomMag(${this.angMomMag.toString()}))`;
    }
}

/**
 * A class for representing the DefinedSumOfStates MCRCMethod.
 * @param {String} name The name of the method. 
 * @param {String} type The type of the method.
 * @param {SumOfStates} sumOfStates The sum of states.
 */
class DefinedSumOfStates extends MCRCMethod {
    constructor(name, type, sumOfStates) {
        super(name, type);
        this.sumOfStates = sumOfStates;
    }
    toString() {
        return `DefinedSumOfStates(${super.toString},
        name(${this.name}),
        sumOfStates(${this.sumOfStates.toString()}))`;
    }
}

/**
 * A class for representing a reaction.
 * @param {String} id The id of the reaction.
 * @param {Reactant[]} reactants The reactants in the reaction.
 * @param {Product[]} products The products of the reaction.
 * @param {Bond[]} bondArray An array of bonds.
 * @param {Map} properties A map of properties.
 * @param {String} DOSCMethod The principal external rotational states method for calculating density of states.
 */
class Reaction {
    constructor(id, reactants, products, bondArray, properties, DOSCMethod) {
        this.id = id;
        this.reactants = reactants;
        this.products = products;
        this.description = description;
        this.atomArray = atomArray;
        this.bondArray = bondArray;
        this.properties = properties;
        this.DOSCMethod = DOSCMethod;
    }
    toString() {
        return `DefinedSumOfStates(${super.toString},
        id(${this.id}),
        reactants(${this.reactants.toString()}),
        products(${this.products.toString()}),
        bondArray(${this.bondArray.toString()}),
        properties(${this.properties.toString()}),
        energy(${this.energy.toString()}),
        DOSCMethod(${this.DOSCMethod.toString()}))`;
    }
}

/**
 * A class for representing a Pressure and Temperature pair.
 * @param {String} units The units of the pair.
 * @param {Number} P The pressure.
 * @param {Number} T The temperature.
 */
class PTpair {
    constructor(units, P, T) {
        this.units = units;
        this.P = P;
        this.T = T;
    }
    toString() {
        return `PTpair(
        units(${this.units}),
        P(${this.P.toString()}),
        T(${this.T.toString()}))`;
    }
}

/**
 * A class for representing the experiment conditions.
 * @param {String} bathGas The bath gas.
 * @param {PTpair[]} pTs The Pressure and Temperature pairs.
 */
class Conditions {
    constructor(bathGas, pTs) {
        this.bathGas = bathGas;
        this.pTs = pTs;
    }
    toString() {
        return `Conditions(
        bathGas(${this.bathGas}),
        pTs(${this.pTs.toString()}))`;
    }
}

/**
 * A class for measures of grain size.
 * @param {Number} value The value.
 * @param {String} units The units.
 */
class GrainSize extends Measure {
    constructor(value, units) {
        super(value, units);
    }
    toString() {
        return `GrainSize(${super.toString()})`;
    }
}

/**
 * A class for model parameters.
 * @param {GrainSize} grainSize The grain size.
 * @param {Number} energyAboveTheTopHill The energy above the top hill.
 */
class ModelParameters {
    constructor(grainSize, energyAboveTheTopHill) {
        this.grainSize = grainSize;
        this.energyAboveTheTopHill = energyAboveTheTopHill;
    }
    toString() {
        return `PTpair(
        grainSize(${this.grainSize.toString()}),
        energyAboveTheTopHill(${this.energyAboveTheTopHill.toString()}))`;
    }
}

/**
 * A class for the diagram energy offset.
 * @param {String} ref The reference.
 * @param {Number} value The value.
 */
class DiagramEnergyOffset {
    constructor(ref, value) {
        this.ref = ref;
        this.value = value;
    }
    toString() {
        return `DiagramEnergyOffset(
        ref(${this.ref}),
        v(${this.value.toString()}))`;
    }
}

/**
 * A class for the control.
 * @param {Boolean} testDOS The test density of states flag.
 * @param {Boolean} printSpeciesProfile The print species profile flag.
 * @param {Boolean} testMicroRates The test micro rates flag.
 * @param {Boolean} testRateConstant The test rate constant flag.
 * @param {Boolean} printGrainDOS The print grain density of states flag.
 * @param {Boolean} printCellDOS The print cell density of states flag.
 * @param {Boolean} printReactionOperatorColumnSums The print reaction operator column sums flag.
 * @param {Boolean} printTunnellingCoefficients The print tunnelling coefficients flag.
 * @param {Boolean} printGrainkfE The print grain kfE flag.
 * @param {Boolean} printGrainBoltzmann The print grain Boltzmann flag.
 * @param {Boolean} printGrainkbE The print grain kbE flag.
 * @param {Number} eigenvalues The (number of?) eigenvalues.
 * @param {Boolean} hideInactive The hide inactive flag.
 * @param {DiagramEnergyOffset} diagramEnergyOffset The diagram energy offset.
 */
class Control {
    constructor(testDOS, printSpeciesProfile, testMicroRates, testRateConstant, printGrainDOS,
        printCellDOS, printReactionOperatorColumnSums, printTunnellingCoefficients, printGrainkfE,
        printGrainBoltzmann, printGrainkbE, eigenvalues, hideInactive, diagramEnergyOffset) {
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
        return `SumOfStatesPoint(
        testDOS(${this.testDOS.toString()}),
        printSpeciesProfile(${this.printSpeciesProfile.toString()}),
        testMicroRates(${this.testMicroRates.toString()}),
        testRateConstant(${this.testRateConstant.toString()}),
        printGrainDOS(${this.printGrainDOS.toString()}),
        printCellDOS(${this.printCellDOS.toString()}),
        printReactionOperatorColumnSums(${this.printReactionOperatorColumnSums.toString()}),
        printTunnellingCoefficients(${this.printTunnellingCoefficients.toString()}),
        printGrainkfE(${this.printGrainkfE.toString()}),
        printGrainBoltzmann(${this.printGrainBoltzmann.toString()}),
        printGrainkbE(${this.printGrainkbE.toString()}),
        eigenvalues(${this.eigenvalues.toString()}),
        hideInactive(${this.hideInactive.toString()}))`;
    }
}