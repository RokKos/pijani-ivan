using UnityEngine;
using UnityEngine.AI;

public class MedvedController : MonoBehaviour
{

    [SerializeField] Transform player;
    [Header("NavMesh settings")]
    [SerializeField] NavMeshAgent navMeshAgent;

    [Range(1,10)]
    [SerializeField] float kTimeToCalculate;

    [Range(1, 100)]
    [SerializeField] float kWakeUpRadius;

    private NavMeshPath path;
    private float timer = 0.0f;
    
    // Start is called before the first frame update
    void Start()
    {
        path = new NavMeshPath();
        timer = 0.0f;
        navMeshAgent.Warp(new Vector3(-30,0, 15));
    }

    // Update is called once per frame
    void Update()
    {

        timer += Time.deltaTime;
        if (timer > kTimeToCalculate) {
            timer = 0;
            NavMesh.CalculatePath(transform.position, player.position, NavMesh.AllAreas, path);

            // Calculate distance to player
            float distanceToPlayer = 0;
            for (int i = 0; i < path.corners.Length - 1; i++) {
                distanceToPlayer += (path.corners[i] - path.corners[i + 1]).magnitude;
            }

            if (distanceToPlayer < kWakeUpRadius) {
                navMeshAgent.SetDestination(player.position);
                transform.LookAt(player);
            }
        }

        // For debug porpuse only (we need to refresh every frame)
        for (int i = 0; i < path.corners.Length - 1; i++) {
            Debug.DrawLine(path.corners[i], path.corners[i + 1], Color.red);
        }




    }
}
