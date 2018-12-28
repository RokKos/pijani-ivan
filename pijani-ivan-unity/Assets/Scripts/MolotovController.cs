using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MolotovController : PoolObjectController
{

    private void Start() {
        Invoke("Destroy", 5);
    }

    public override void Destroy() {
        base.Destroy();
        bulletPoolController.ReturnMolotov(this);
    }


}
