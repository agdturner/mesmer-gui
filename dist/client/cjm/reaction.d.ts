import { Molecule } from './molecule.js';
import { Attributes, NumberWithAttributes } from './classes.js';
/**
 * A class for representing a Reaction Molecule.
 */
export declare class ReactionMolecule extends Attributes {
    /**
     * A reference to the molecule.
     */
    molecule: Molecule;
    /**
     * @param {Map<string, string>} attributes The attributes.
     * @param {Molecule} molecule The molecule.
     */
    constructor(attributes: Map<string, string>, molecule: Molecule);
    /**
     * Get the XML representation.
     * @param {string} tagName The tag name.
     * @param {string} pad The pad for an extra level of padding (Optional).
     * @param {string} padding The padding (Optional).
     * @returns An XML representation.
     */
    toXML(tagName: string, pad?: string | undefined, padding?: string | undefined): string;
}
/**
 * A class for representing a reactant.
 * This is a molecule often with a role in a reaction.
 */
export declare class Reactant extends ReactionMolecule {
    /**
     * @param {Map<string, string>} attributes The attributes.
     * @param {Molecule} molecule The molecule.
     */
    constructor(attributes: Map<string, string>, molecule: Molecule);
}
/**
 * A class for representing a product.
 * This is a molecule produced in a reaction.
 */
export declare class Product extends ReactionMolecule {
    /**
     * @param {Map<string, string>} attributes The attributes.
     * @param {Molecule} molecule The molecule.
     */
    constructor(attributes: Map<string, string>, molecule: Molecule);
}
/**
 * A class for representing a transition state.
 */
export declare class TransitionState extends ReactionMolecule {
    /**
     * @param {Map<string, string>} attributes The attributes.
     * @param {Molecule} molecule The molecule.
     */
    constructor(attributes: Map<string, string>, molecule: Molecule);
    /**
     * A convenience method to get the ref (the molecule ID) of the transition state.
     * @returns The ref of the transition state.
     */
    getRef(): string;
}
/**
 * A class for representing the Arrhenius pre-exponential factor.
 */
export declare class PreExponential extends NumberWithAttributes {
    /**
     * A class for representing the Arrhenius pre-exponential factor.
     * @param {Map<string, string>} attributes The attributes.
     * @param {number} value The value of the factor.
     */
    constructor(attributes: Map<string, string>, value: number);
}
/**
 * A class for representing the Arrhenius activation energy factor.
 */
export declare class ActivationEnergy extends NumberWithAttributes {
    /**
     * A class for representing the Arrhenius pre-exponential factor.
     * @param {Map<string, string>} attributes The attributes.
     * @param {number} value The value of the factor.
     */
    constructor(attributes: Map<string, string>, value: number);
}
/**
 * A class for representing the reference temperature.
 */
export declare class TInfinity extends NumberWithAttributes {
    /**
     * @param {Map<string, string>} attributes The attributes.
     * @param {number} value The value of the factor.
     */
    constructor(attributes: Map<string, string>, value: number);
}
/**
 * A class for representing the modified Arrhenius parameter factor.
 */
export declare class NInfinity extends NumberWithAttributes {
    /**
     * @param {Map<string, string>} attributes The attributes.
     * @param {number} value The value of the factor.
     */
    constructor(attributes: Map<string, string>, value: number);
}
/**
 * A class for representing tunneling.
 */
export declare class Tunneling extends Attributes {
    /**
     * @param {Map<string, string>} attributes The attributes.
     */
    constructor(attributes: Map<string, string>);
}
/**
 * A class for representing the MCRCMethod specifications.
 * Extended classes indicate how microcanonical rate constant is to be treated.
 */
export declare class MCRCMethod extends Attributes {
    /**
     * The name of the method.
     */
    mCRCMethodName: string;
    /**
     * @param {Map<string, string>} attributes The attributes.
     * @param {string} name The name or xsi:type of the method.
     */
    constructor(attributes: Map<string, string>, name: string);
    toString(): string;
}
/**
 * A class for representing the inverse Laplace transform (ILT) type of microcanonical rate constant.
 */
export declare class MesmerILT extends MCRCMethod {
    /**
     * The pre-exponential factor.
     */
    preExponential: PreExponential | undefined;
    /**
     * The activation energy.
     */
    activationEnergy: ActivationEnergy | undefined;
    /**
     * The TInfinity.
     */
    tInfinity: TInfinity | undefined;
    /**
     * The nInfinity.
     */
    nInfinity: NInfinity | undefined;
    /**
     * @param {Map<string, string>} attributes The attributes.
     * @param {PreExponential | undefined} preExponential The pre-exponential factor.
     * @param {ActivationEnergy | undefined} activationEnergy The activation energy.
     * @param {TInfinity | undefined} tInfinity The TInfinity.
     * @param {NInfinity | undefined} nInfinity The nInfinity.
     */
    constructor(attributes: Map<string, string>, preExponential: PreExponential | undefined, activationEnergy: ActivationEnergy | undefined, tInfinity: TInfinity | undefined, nInfinity: NInfinity | undefined);
    toString(): string;
    /**
     * Get the XML representation.
     * @param {string} tagName The tag name.
     * @param {string} padding The padding (Optional).
     * @returns An XML representation.
     */
    toXML(tagName: string, padding?: string | undefined): string;
}
/**
 * A class for representing the Zhu-Nakamura crossing MCRCMethod.
 */
export declare class ZhuNakamuraCrossing extends MCRCMethod {
    harmonicReactantDiabat_FC: number;
    harmonicReactantDiabat_XO: number;
    harmonicProductDiabat_DE: number;
    exponentialProductDiabat_A: number;
    exponentialProductDiabat_B: number;
    exponentialProductDiabat_DE: number;
    /**
     * @param {Map<string, string>} attributes The attributes.
     * @param {number} harmonicReactantDiabat_FC The harmonic reactant diabatic FC.
     * @param {number} harmonicReactantDiabat_XO The harmonic reactant diabatic XO.
     * @param {number} harmonicProductDiabat_DE The harmonic product diabatic DE.
     * @param {number} exponentialProductDiabat_A The exponential product diabatic A.
     * @param {number} exponentialProductDiabat_B The exponential product diabatic B.
     * @param {number} exponentialProductDiabat_DE The exponential product diabatic DE.
     */
    constructor(attributes: Map<string, string>, harmonicReactantDiabat_FC: number, harmonicReactantDiabat_XO: number, harmonicProductDiabat_DE: number, exponentialProductDiabat_A: number, exponentialProductDiabat_B: number, exponentialProductDiabat_DE: number);
    toString(): string;
}
/**
 * A class for representing the sum of states.
 * @param {string} units The units of energy.
 * @param {boolean} angularMomentum The angular momentum attribute.
 * @param {boolean} noLogSpline The no log spline attribute.
 * @param {SumOfStatesPoint[]} sumOfStatesPoints The sum of states points.
 */
/**
 * A class for representing a sum of states point.
 * @param {number} value The value of the point.
 * @param {number} energy The energy of the point.
 * @param {number} angMomMag The angular momentum magnitude of the point.
 */
/**
 * A class for representing the DefinedSumOfStates MCRCMethod.
 * @param {string} name The name or xsi:type of the method.
 * @param {SumOfStates} sumOfStates The sum of states.
 */
/**
 * A class for representing a reaction.
 */
export declare class Reaction extends Attributes {
    /**
     * The id of the reaction. This is also stored in the attributes, but is hee for convenience...
     */
    id: string;
    /**
     * The reactants in the reaction.
     */
    reactants: Map<string, Reactant>;
    /**
     * The products of the reaction.
     */
    products: Map<string, Product>;
    /**
     * The MCRCMethod.
     */
    mCRCMethod: MCRCMethod | undefined;
    /**
     * The transition state.
     */
    transitionState: TransitionState | undefined;
    /**
     * The tunneling.
     */
    tunneling: Tunneling | undefined;
    /**
     * @param {Map<string, string>} attributes The attributes.
     * @param {string} id The id of the reaction.
     * @param {Map<string, Reactant>} reactants The reactants in the reaction.
     * @param {Map<string, Product>} products The products of the reaction.
     * @param {MCRCMethod | undefined} mCRCMethod The MCRCMethod (optional).
     * @param {TransitionState | undefined} transitionState The transition state (optional).
     * @param {Tunneling | undefined} tunneling The tunneling (optional).
     */
    constructor(attributes: Map<string, string>, id: string, reactants: Map<string, Reactant>, products: Map<string, Product>, mCRCMethod?: MCRCMethod | undefined, transitionState?: TransitionState | undefined, tunneling?: Tunneling | undefined);
    /**
     * Convert the product to a string.
     * @returns String representation of the product.
     */
    toString(): string;
    /**
     * Get the label of the reactants.
     * @returns The label of the reactants.
     */
    getReactantsLabel(): string;
    /**
     * Get the combined energy of the reactants.
     * @returns The combined energy of the reactants.
     */
    getReactantsEnergy(): number;
    /**
     * Returns the label for the products.
     * @returns The label for the products.
     */
    getProductsLabel(): string;
    /**
     * Returns the total energy of all products.
     * @returns The total energy of all products.
     */
    getProductsEnergy(): number;
    /**
     * Get the label of the reaction.
     * @returns The label of the reaction.
     */
    getLabel(): string;
    /**
     * @param {string} tagName The tag name.
     * @param {string} pad The pad (Optional).
     * @param {number} level The level of padding (Optional).
     * @returns An XML representation.
     */
    toXML(tagName: string, pad?: string, level?: number): string;
}
