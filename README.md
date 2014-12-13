AC 209 Data Science Final project 
===================
### (Gifs loading, give a minute, it's worth it)

<img src="http://i.imgur.com/pgXt52x.gif">

(*Ab initio Molecular Dynamics of Molecules doing the Harlem Shake*)

# Contents
- [The Idea](#the-idea) 
- [Data](#data) 
- [Exploration Visualization](#exploration-visualization) 
- [Finding Patterns](#finding-patterns) 
- [Future Directions](#future-directions) 
- [Requirements](#requirements) 

# The Idea
**Can we "discover" chemistry concepts via patterns in data?** 
*(Obviously, let me explain more about what I mean)*

Molecules are small objects whose chemical behaviour is governs by physcial laws (Quantum Mechancis) and the dynamics between protons and electrons.
<img src="http://fat.gfycat.com/GeneralWarmheartedGopher.gif">

Turns out we can simulate these laws in a computer, solving the Schrödinger equation to obtain molecular properties that you could otherwise obtain via an experiment.

Computational chemistry is finally in a position to conduct studies on hundreds or even thousands of molecules within a reasonable amount of time. That means a lot of data :).

Recently in Ramakrishnan et Al. reported in Nature Scientific Data, ["Quantum chemistry structures and properties of 134 kilo molecules"](http://www.nature.com/articles/sdata201422) a data set 134k calculated molecules. 

Part of the philosophy of calculating molecules on a computer is the "First Principles", "Ab-initio", "Without knowing anything" mind set, we want to predict and model reality (molecular reality that is) without previous knowledge, without emphirical observations (at least to certain degree). 

*For example if a computer had molecules of the skin of tomato, would it know the tomato is red?* By simulating how light hits the molecules and bounces back we can find out the wavelength of this returned light, and find out it is actually within the spectrum of the color "red". **We can predict the tomato is red "without knowing anything"**.

The aim of this project is to play around with this dataset and see what chemistry we can learn.

# Data

Dataset is hosted on [figshare](http://dx.doi.org/10.6084/m9.figshare.978904), it is a few hundred MB's.
Each calculation is in a specially formated text file (xyz file) which cotains the optimized geometry, the energetics and thermodynamic properties for a single molecule. There are in total 134k stable small organic molecules made up of CHONF atoms.
The first step was to parse each file in a very specific way, as indicated in the README.txt included in the data set.

I created a pandas dataframe, with a row for each molecule, containing all the information within the txt file. This data structure can easily be converted to other more information-friendly formats (excel, databases, json). 
A pandas dataframe pickle can be downloaded [here](https://www.dropbox.com/sh/6iysi4w0xmmevlt/AABrTLUFZJvrJPDeDCzuhxJYa?dl=0).
I also computed a few other descriptors not included in the article, such as enthalpies of Atomization and molecular weight.

The entire data set once filtered is a 130830 molecules by 25 features.
![Data Wrangling](http://i.imgur.com/zFEFEX2.png)

# Exploration Visualization
I carried out first an inital exploration of all variables, to see which ones were more correlated, which ones were redundant and also to classify molecules based on their rotation.

The variables to explore were:
* Size: Number of atoms, Molecular Weight, Spatial Extensivity.
* Rotation: Rotational Constants and Clases.
* Energetics: Internal energy, Enthalpy, Gibbs free energy, Zero Point Energy, Atomization Energies.
* Special Properties: Electronic Band Gap, Molar Heat Capacity, Dipole Moment and Polarizability

## Some examples:

**Here we have a random selection of ten molecules**:
![Random Selection of molecules](http://i.imgur.com/6fgfTsT.png)

**Distribution of the number of atoms on each Molecule**:
![Imgur](http://i.imgur.com/6Bqgbu8.png)

**Distribution of the molecular weight, two groups are apparent**:
![Imgur](http://i.imgur.com/r88fSr2.png)

**Violinplots of Rot Constants (A,B,C) for different types of rotors **
= (Asymmetrical, Linear, Oblate, Prolate and Spherical) respectively:
![Imgur](http://i.imgur.com/pyqfg4b.png)

Due to the sheer number of samples, **many variables followed a normal distribution** (like Heat Capacity), these types of variables can sometimes be removed for modelling since there is little variability.
![Imgur](http://i.imgur.com/ggdfHD9.png)

While other properties were much more interesting suggesting possible clusters of molecules here we have the **Distribution of Electronic Band gaps **.
![Imgur](http://i.imgur.com/fjCFqv0.png)

**Distribution of Enthalpies of Atomization ** also displays with some peaks.
![Imgur](http://i.imgur.com/NVRfL8R.png)


# Finding Patterns 
Machine Learning enters the foray!

Having explored the dataset we can trim and have a better idea of what types of techniques might work.
I decided to tryout to train a molecular classifiy. The criteria was common substructures.
In this specific case I focused on benzene rings, which are carbon atoms arranged in form of a hexagon.
The idea was to see what type of molecular properties are going to be influed by the presence of these substructures.

Here we have one molecule that does have a benzene ring and another that dosen't. 
![Imgur](http://i.imgur.com/7bXLKKb.png)
Ideally **we would want an algorithm that would take as input molecular properties and without reference of geometry could predict if it has this structure o not.** I set to do this.

Using RDKit, I did a substructure matching of this ring in all molecules, this would be for validation purposes.
And so after this I then took a sample of ~250 molecules for each class (equal representation), with Ring and without. Below are a subset of these molecules.
![Imgur](http://i.imgur.com/Tmnpoex.png)

To start the Machine Learning I reduced the number of variables from 25 to 12 using only: rot constants A, B and C, the dipole moment, polarizability, electronic bandgap, electronic spatial extent, zero point energy, 0 temperature enthalpy, Heat Capacity, molecular Weight and enthalpy of Atomization.

Initially I tried with a RandomForest classifier, first I had to find out the optimal number of trees to use. Using a grid search and KFold=10 cross validation I found out that the best number of Trees was 11, giving a really good mean score of **0.928 (49)**. These results can be seen below:

![Imgur](http://i.imgur.com/7vPZXMi.png)

Then with a good estimator, I extracted the most important features used in the classification. With the idea of finding what makes "Ringed" molecules different from a random subset.

![Imgur](http://i.imgur.com/kZ9PPuO.png)

The top 5 features were in order of increasing importance were: Heat Capacity, Molecular Weight, Zero Point Energy,
           **Rotational Constant C** and **Electronic Band Gap**!
These resulted motivated me to look at the top two features and make sense of their distribution using violinplots (Yellow="Ringed", Green="Non-Ringed".
![Imgur](http://i.imgur.com/r4QKt1F.png)
![Imgur](http://i.imgur.com/NGeVegR.png)

We can clearly see different distributions in both features, this can be contrasted with **Molecular Weight**, which is much less important is while a bit shifted, has the same distribution.
![Imgur](http://i.imgur.com/Vb8amRk.png)

The electronic bandgap makes sense, this property indicated how well a material will serve as a conductor, semi-conductor or insulator. The lower the bandgap, the more conductive a material will be.
There are multiple attempts to create organic semiconductors and the building blocks for these are aromatic rings composed by chains of these simple rings. In contrast with the random sample which has a much higher gap.
**This can be considered a small success!**

I also tried out other classifying techniques such as Naive-Bayes, K-Nearest Neighbors and Support Vector Machine. The results are summarized in the following table, in each case KFold=10, cross validation was used:

| Method        | Mean Score    |  Std Score |
| ------------- |:-------------:| -----:|
| Naive-Bayes     | 0.865 | 0.066 |
|  K-NN    | 0.585      |   0.087 |
| SVM | 0.745    |  0.121   |
| **RandomForest** | 0.928    |  0.043   |


# Future Directions
I only tried matching one substructure, there are many functional groups, substructures that influenced strongly the chemical behavior of a molecule.
I had a priori knowledge of this substructure, with more time it would be interesting to see if you can discover these substructures by themselves.
There are many techniques I did not try out. Also regression was not explored.
In a more tough problem you could think of trying to predict accurately all chemical properties from just the geometric coordinates and atoms list. 

There is certaintly much more work to be done and many venues to explore with data science and Quantum Chemistry.
For the most part I stuck to the available dataset, yet I feel there could be more interesting data embedded in the calculations which is not included in the data set.
Examples:
* **Frequencies**, only frequencies were reported but amplitudes were not. Using amplitudes and frequencies together you could devise spectra features such as spectral centroids, brightness o cSpectrum.
* **Coulombic Matrix**, The matrix of electromagnetic interaction between different
molecules.
* **Orbital Occupation Numbers**, Occupation numbers for the electrons within the molecular orbitals.

The main idea would be design and find descriptor that can not be found in a classical way, to demonstrate that a quantum calculation has more conection to reality than a classical one. (at the molecular level).

Anyways, had a lot of fun, here is another gif for reading all these notes:
<img src="http://giant.gfycat.com/FairWaryBactrian.gif">

# Requirement
* Sci-kit learn
* Pandas
* Matplotlib
* Seaborn
* Numpy
* Ipython notebook
* RDKit
* Pybel and Openbabel
* Sense of data adventure
