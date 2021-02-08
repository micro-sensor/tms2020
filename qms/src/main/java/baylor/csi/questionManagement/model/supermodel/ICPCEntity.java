package baylor.csi.questionManagement.model.supermodel;

import java.io.Serializable;

/**
 * Interface specifies ICPC entity, which has to contain id.
 */
public interface ICPCEntity extends Serializable, Cloneable {

    Long getId();

}

